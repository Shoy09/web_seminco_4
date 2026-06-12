import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { OperacionBase } from '../../../../models/OperacionBase.models';
import { OperacionesService } from '../../../../services/operaciones.service';
import { ToastService } from '../../../../services/toast.service';
import {
  ValidacionEquipoConfig,
  getValidacionEquipoConfig,
} from '../../data/validacion-equipos';
import { TablaOperacionesGeneralComponent } from '../../components/tabla-operaciones-general/tabla-operaciones-general.component';
import {
  cloneOperacion,
  deepEqual,
  getCampoObservacion,
  parseOperacionDetalle,
  safeParseJson,
} from '../../utils/validacion-operacion.utils';

@Component({
  selector: 'app-detalle-validacion-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    ProgressSpinnerModule,
    TagModule,
    TablaOperacionesGeneralComponent,
  ],
  templateUrl: './detalle-validacion-page.component.html',
  styleUrl: './detalle-validacion-page.component.css',
})
export class DetalleValidacionPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly operacionesService = inject(OperacionesService);
  private readonly toastService = inject(ToastService);

  equipoConfig?: ValidacionEquipoConfig;
  operacionOriginal?: OperacionBase;
  draft?: OperacionBase;

  registros: any[] = [];
  horometros: Record<string, any> = {};
  condicionesEquipo: Record<string, any> = {};
  checkList: any[] = [];
  controlLlantas: Record<string, any> = {};

  loading = false;
  saving = false;

  showHorometrosDialog = false;
  showCondicionesDialog = false;
  showChecklistDialog = false;
  showLlantasDialog = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.equipoConfig = getValidacionEquipoConfig(params.get('equipo'));
      const id = Number(params.get('id'));

      if (!this.equipoConfig || !id) {
        this.toastService.error('Detalle invalido', 'La operacion o el equipo no son validos.');
        this.router.navigate(['/validaciones/jefe-mina']);
        return;
      }

      this.cargarDetalle(id);
    });
  }

  cargarDetalle(id: number): void {
    if (!this.equipoConfig) {
      return;
    }

    this.loading = true;
    this.operacionesService.getById(this.equipoConfig.tipoApi, id).subscribe({
      next: (response) => {
        this.operacionOriginal = response.data;
        this.draft = cloneOperacion(response.data);

        const parsed = parseOperacionDetalle(response.data);
        this.registros = cloneOperacion(parsed.registros ?? []);
        this.horometros = cloneOperacion(parsed.horometros ?? {});
        this.condicionesEquipo = cloneOperacion(parsed.condicionesEquipo ?? {});
        this.checkList = cloneOperacion(parsed.checkList ?? []);
        this.controlLlantas = cloneOperacion(parsed.controlLlantas ?? {});

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('No se pudo cargar el detalle', 'Revisa la conexion o el identificador del registro.');
      },
    });
  }

  guardarValidacion(aprobacion: 1 | 2): void {
    if (!this.equipoConfig || !this.operacionOriginal || !this.draft?.id) {
      return;
    }

    const revisionActual = this.operacionOriginal.revisado ?? 0;
    if (revisionActual >= 3) {
      this.toastService.warn('Limite alcanzado', 'Este registro ya no admite mas revisiones.');
      return;
    }

    const payload: any = {
      ...this.draft,
      registros: this.equipoConfig.stringifyRegistrosOnSave ? JSON.stringify(this.registros) : this.registros,
      horometros: JSON.stringify(this.horometros),
      condiciones_equipo: JSON.stringify(this.condicionesEquipo),
      check_list: this.checkList.map((item) => ({
        ...item,
        decision: item.decision ? 1 : 0,
      })),
      control_llantas: this.controlLlantas,
      revisado: revisionActual + 1,
      aprobacion,
      [getCampoObservacion(revisionActual)]: JSON.stringify(this.operacionOriginal),
    };

    this.saving = true;
    this.operacionesService.actualizar(this.equipoConfig.tipoApi, this.draft.id, payload).subscribe({
      next: () => {
        this.saving = false;
        const huboCambios = this.tieneCambios(payload);
        this.toastService.success(
          aprobacion === 1 ? 'Registro aprobado' : 'Registro rechazado',
          huboCambios
            ? `La validacion se guardo como revision ${revisionActual + 1}.`
            : `La decision se registro sin cambios estructurales en la data.`,
        );
        this.cargarDetalle(this.draft!.id!);
      },
      error: () => {
        this.saving = false;
        this.toastService.error('No se pudo guardar la validacion', 'El backend rechazo la actualizacion del registro.');
      },
    });
  }

  getHorometroKeys(): string[] {
    return Object.keys(this.horometros ?? {});
  }

  getCondicionKeys(): string[] {
    return Object.keys(this.condicionesEquipo ?? {});
  }

  getLlantasKeys(): string[] {
    return Object.keys(this.controlLlantas ?? {});
  }

  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  isNumberLike(value: any): boolean {
    return typeof value === 'number';
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  getChecklistDecision(item: any): boolean {
    return item?.decision === true || item?.decision === 1;
  }

  setChecklistDecision(item: any, value: boolean): void {
    item.decision = value;
  }

  updateCondicionValue(key: string, value: any): void {
    this.condicionesEquipo[key] = value;
  }

  updateLlantaValue(key: string, value: any): void {
    this.controlLlantas[key] = value;
  }

  stringify(value: any): string {
    if (value == null) return '';
    return this.isObject(value) || Array.isArray(value)
      ? JSON.stringify(value, null, 2)
      : String(value);
  }

  openDialog(dialog: 'horometros' | 'condiciones' | 'checklist' | 'llantas'): void {
    this.closeDialogs();

    if (dialog === 'horometros') this.showHorometrosDialog = true;
    if (dialog === 'condiciones') this.showCondicionesDialog = true;
    if (dialog === 'checklist') this.showChecklistDialog = true;
    if (dialog === 'llantas') this.showLlantasDialog = true;
  }

  closeDialogs(): void {
    this.showHorometrosDialog = false;
    this.showCondicionesDialog = false;
    this.showChecklistDialog = false;
    this.showLlantasDialog = false;
  }

  private tieneCambios(payload: Record<string, any>): boolean {
    if (!this.operacionOriginal) {
      return true;
    }

    const originalComparable = {
      ...this.operacionOriginal,
      registros: safeParseJson(this.operacionOriginal.registros, this.operacionOriginal.registros ?? []),
      horometros: safeParseJson(this.operacionOriginal.horometros, {}),
      condiciones_equipo: safeParseJson(this.operacionOriginal.condiciones_equipo, {}),
      check_list: this.operacionOriginal.check_list,
      control_llantas: this.operacionOriginal.control_llantas,
      revisado: payload['revisado'],
      aprobacion: payload['aprobacion'],
    };

    const payloadComparable = {
      ...payload,
      registros: safeParseJson(payload['registros'], payload['registros']),
      horometros: safeParseJson(payload['horometros'], {}),
      condiciones_equipo: safeParseJson(payload['condiciones_equipo'], {}),
      check_list: payload['check_list'],
      control_llantas: payload['control_llantas'],
      observaciones_jefe: originalComparable.observaciones_jefe,
      observaciones_jefe2: originalComparable.observaciones_jefe2,
      observaciones_jefe3: originalComparable.observaciones_jefe3,
    };

    return !deepEqual(originalComparable, payloadComparable);
  }
}
