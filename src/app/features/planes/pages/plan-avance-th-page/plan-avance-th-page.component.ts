import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ConfirmService } from '../../../../services/confirm.service';
import { ToastService } from '../../../../services/toast.service';
import { PlanAvanceTH } from '../../../../models/PlanAvanceTH';
import { Proceso } from '../../../../models/Proceso';
import { Labor } from '../../../../models/Labor';
import { Periodo } from '../../../../models/Periodo';
import { Turno } from '../../../../models/Turno';
import { Ley } from '../../../../models/Ley';
import { PlanAvanceTHPayload, PlanesService } from '../../../../services/planes.service';

type PlanAvanceThView = Omit<PlanAvanceTH, 'created_at' | 'updated_at'> & {
  created_at: Date | string | null;
  updated_at: Date | string | null;
};

type PlanAvanceThForm = {
  labor_id: number | null;
  periodo_id: number | null;
  turno_id: number | null;
  ley_id: number | null;
  proceso_id: number | null;
  dia: number | null;
  valor: number | null;
};

@Component({
  selector: 'app-plan-avance-th-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ProgressSpinnerModule,
    SelectModule,
    TableModule,
  ],
  templateUrl: './plan-avance-th-page.component.html',
  styleUrl: './plan-avance-th-page.component.css',
})
export class PlanAvanceThPageComponent implements OnInit {
  private readonly planAvanceTHService = inject(PlanesService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);

  planes: PlanAvanceThView[] = [];
  planesFiltrados: PlanAvanceThView[] = [];

  procesos: Proceso[] = [];
  labores: Labor[] = [];
  periodos: Periodo[] = [];
  turnos: Turno[] = [];
  leyes: Ley[] = [];

  loading = false;
  loadingCatalogos = false;
  saving = false;
  dialogVisible = false;
  editingPlanId: number | null = null;

  busqueda = '';
  procesoFiltro = '';
  turnoFiltro = '';
  periodoFiltro: number | '' = '';

  form: PlanAvanceThForm = this.crearFormularioInicial();

  ngOnInit(): void {
    this.cargarPlanes();
  }

  cargarPlanes(periodoId?: number | null): void {
    this.loading = true;
    this.planAvanceTHService
      .getPlanesAvanceTH(periodoId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (planes) => {
          this.planes = planes;
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error(
            'No se pudieron cargar los planes de metraje TL',
            'Revisa la conexion con el backend.',
          );
        },
      });
  }

  abrirNuevoPlan(): void {
    this.editingPlanId = null;
    this.form = this.crearFormularioInicial();
    this.dialogVisible = true;
  }

  editarPlan(plan: PlanAvanceThView): void {
    this.editingPlanId = plan.planMetrajeAvanceId;
    this.form = {
      labor_id: plan.labor_id,
      periodo_id: plan.periodo_id,
      turno_id: plan.turno_id,
      ley_id: plan.ley_id,
      proceso_id: plan.proceso_id,
      dia: plan.dia,
      valor: plan.valor
    };
    this.dialogVisible = true;
  }

  guardarPlan(): void {
    const payload = this.construirPayload();

    if (!payload) {
      this.toastService.warn(
        'Campos requeridos',
        'Completa labor, periodo, turno, ley, proceso, dia y valor antes de guardar.',
      );
      return;
    }

    this.saving = true;

    const request =
      this.editingPlanId === null
        ? this.planAvanceTHService.createPlanAvanceTH(payload)
        : this.planAvanceTHService.updatePlanAvanceTH(
            this.editingPlanId,
            payload,
          );

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(
          this.editingPlanId === null
            ? 'Plan de metraje TL creado'
            : 'Plan de metraje TL actualizado',
        );
        this.dialogVisible = false;
        this.cargarPlanes();
      },
      error: () => {
        this.toastService.error(
          this.editingPlanId === null
            ? 'No se pudo crear el plan de metraje TL'
            : 'No se pudo actualizar el plan de metraje TL',
        );
      },
    });
  }

  eliminarPlan(plan: PlanAvanceThView): void {
    this.confirmService.confirmDelete(
      `Se eliminara el plan ${plan.planMetrajeAvanceId} de ${plan.labor_nombre}. Esta accion no se puede deshacer.`,
      () => {
        this.planAvanceTHService
          .deletePlanAvanceTH(plan.planMetrajeAvanceId)
          .subscribe({
            next: () => {
              this.toastService.success('Plan de metraje TL eliminado');
              this.planes = this.planes.filter(
                (item) => item.planMetrajeAvanceId !== plan.planMetrajeAvanceId,
              );
              this.aplicarFiltros();
            },
            error: () => {
              this.toastService.error(
                'No se pudo eliminar el plan de metraje TL',
              );
            },
          });
      },
    );
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    this.planesFiltrados = this.planes.filter((plan) => {
      const proceso = plan.proceso_nombre;
      const turno = plan.turno_nombre;
      const periodo = this.getPeriodoLabel(plan.periodo_id);
      const labor = plan.labor_nombre;
      const ley = plan.ley_nombre;

      if (this.procesoFiltro && proceso !== this.procesoFiltro) {
        return false;
      }

      if (this.turnoFiltro && turno !== this.turnoFiltro) {
        return false;
      }

      if (!texto) {
        return true;
      }

      return [
        labor,
        periodo,
        turno,
        ley,
        proceso,
        String(plan.dia),
        String(plan.valor),
      ]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(texto));
    });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.procesoFiltro = '';
    this.turnoFiltro = '';
    this.periodoFiltro = '';
    this.cargarPlanes();
  }

  onPeriodoFiltroChange(): void {
    this.cargarPlanes(this.periodoFiltro === '' ? null : this.periodoFiltro);
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.editingPlanId = null;
  }

  get tituloDialog(): string {
    return this.editingPlanId === null
      ? 'Nuevo plan de metraje TL'
      : 'Editar plan de metraje TL';
  }


  get laborOptions(): Array<{ label: string; value: number }> {
    return this.labores.map((labor) => ({
      label: labor.nombre_labor,
      value: labor.laborId,
    }));
  }

  get periodoOptions(): Array<{ label: string; value: number }> {
    return this.periodos.map((periodo) => ({
      label: this.formatearPeriodoLabel(periodo),
      value: periodo.periodoId,
    }));
  }

  get turnoOptions(): Array<{ label: string; value: number }> {
    return this.turnos.map((turno) => ({
      label: turno.nombre,
      value: turno.turnoId,
    }));
  }

  get leyOptions(): Array<{ label: string; value: number }> {
    return this.leyes.map((ley) => ({ label: ley.nombre, value: ley.leyId }));
  }

  get procesoOptions(): Array<{ label: string; value: number }> {
    return this.procesos.map((proceso) => ({
      label: proceso.nombre,
      value: proceso.id,
    }));
  }

  get procesoFiltroOptions(): Array<{ label: string; value: string }> {
    return [
      { label: 'Todos los procesos', value: '' },
      ...this.procesos.map((proceso) => ({
        label: proceso.nombre,
        value: proceso.nombre,
      })),
    ];
  }

  get turnoFiltroOptions(): Array<{ label: string; value: string }> {
    return [
      { label: 'Todos los turnos', value: '' },
      ...this.turnos.map((turno) => ({
        label: turno.nombre,
        value: turno.nombre,
      })),
    ];
  }

  get periodoFiltroOptions(): Array<{ label: string; value: number | '' }> {
    return [
      { label: 'Todos los periodos', value: '' },
      ...this.periodos.map((periodo) => ({
        label: this.formatearPeriodoLabel(periodo),
        value: periodo.periodoId,
      })),
    ];
  }

  getPeriodoLabel(periodoId: number): string {
    const periodo = this.periodos.find((p) => p.periodoId === periodoId);
    return periodo
      ? this.formatearPeriodoLabel(periodo)
      : `Periodo ${periodoId}`;
  }

  getFechaLabel(fecha: Date | string | null): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    const parsed = this.parseFecha(fecha);

    if (!parsed) {
      return typeof fecha === 'string' ? fecha : 'Sin fecha';
    }

    return parsed.toLocaleString('es-PE');
  }

  private crearFormularioInicial(): PlanAvanceThForm {
    return {
      labor_id: null,
      periodo_id: null,
      turno_id: null,
      ley_id: null,
      proceso_id: null,
      dia: null,
      valor: null,
    };
  }

  private construirPayload(): PlanAvanceTHPayload | null {
    const labor_id = this.form.labor_id;
    const periodo_id = this.form.periodo_id;
    const turno_id = this.form.turno_id;
    const ley_id = this.form.ley_id;
    const proceso_id = this.form.proceso_id;
    const dia = this.form.dia;
    const valor = this.form.valor;

    if (
      labor_id === null ||
      periodo_id === null ||
      turno_id === null ||
      ley_id === null ||
      proceso_id === null ||
      dia === null ||
      valor === null
    ) {
      return null;
    }

    return {
      labor_id,
      periodo_id,
      turno_id,
      ley_id,
      proceso_id,
      dia,
      valor,
    };
  }

  private formatearPeriodoLabel(periodo: Periodo): string {
    const tipo = periodo.tipo?.trim() || 'PERIODO';
    const numero = periodo.numero;
    const anno = periodo.anno;
    const inicio = this.formatearFechaCorta(periodo.fecha_inicio);
    const fin = this.formatearFechaCorta(periodo.fecha_fin);

    const encabezado = [
      tipo,
      numero !== null ? numero : null,
      anno !== null ? anno : null,
    ]
      .filter((valor) => valor !== null && valor !== undefined && valor !== '')
      .join(' ');

    return inicio && fin ? `${encabezado} (${inicio} - ${fin})` : encabezado;
  }

  private formatearFechaCorta(fecha: Date | string | null | undefined): string {
    if (!fecha) {
      return '';
    }

    if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return fecha;
    }

    const parsed = this.parseFecha(fecha);

    if (!parsed) {
      return typeof fecha === 'string' ? fecha : '';
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseFecha(valor: Date | string): Date | null {
    if (valor instanceof Date) {
      return Number.isNaN(valor.getTime()) ? null : valor;
    }

    const parsed = new Date(valor);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}
