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
import { Labor } from '../../../../models/Labor';
import { ConfirmService } from '../../../../services/confirm.service';
import { LaborPayload, LaborService } from '../../../../services/labor.service';
import { ToastService } from '../../../../services/toast.service';

type LaborForm = {
  mina_id: number | null;
  zona_id: number | null;
  area_id: number | null;
  fase_id: number | null;
  tipo_labor_id: number | null;
  estructura_mineral_id: number | null;
  nivel_id: number | null;
  ala_id: number | null;
  nombre_labor: string;
  estado: string;
};

@Component({
  selector: 'app-labores-page',
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
  templateUrl: './labores-page.component.html',
  styleUrl: './labores-page.component.css'
})
export class LaboresPageComponent implements OnInit {
  private readonly laborService = inject(LaborService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);

  labores: Labor[] = [];
  laboresFiltradas: Labor[] = [];

  loading = false;
  saving = false;
  dialogVisible = false;
  editingLaborId: number | null = null;

  busqueda = '';
  estadoFiltro = '';

  form: LaborForm = this.crearFormularioInicial();

  ngOnInit(): void {
    this.cargarLabores();
  }

  cargarLabores(): void {
    this.loading = true;
    this.laborService
      .getLabores()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (labores) => {
          this.labores = labores;
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error('No se pudieron cargar las labores');
        },
      });
  }

  abrirNuevaLabor(): void {
    this.editingLaborId = null;
    this.form = this.crearFormularioInicial();
    this.dialogVisible = true;
  }

  editarLabor(labor: Labor): void {
    this.editingLaborId = labor.laborId;
    this.form = {
      mina_id: this.normalizarNumero(labor.mina_id),
      zona_id: this.normalizarNumero(labor.zona_id),
      area_id: this.normalizarNumero(labor.area_id),
      fase_id: this.normalizarNumero(labor.fase_id),
      tipo_labor_id: this.normalizarNumero(labor.tipo_labor_id),
      estructura_mineral_id: this.normalizarNumero(labor.estructura_mineral_id),
      nivel_id: this.normalizarNumero(labor.nivel_id),
      ala_id: this.normalizarNumero(labor.ala_id),
      nombre_labor: labor.nombre_labor,
      estado: labor.estado,
    };
    this.dialogVisible = true;
  }

  guardarLabor(): void {
    const payload = this.construirPayload();

    if (!payload) {
      this.toastService.warn(
        'Campos requeridos',
        'Completa todos los IDs relacionados, el nombre y el estado antes de guardar.'
      );
      return;
    }

    this.saving = true;

    const request = this.editingLaborId === null
      ? this.laborService.createLabor(payload)
      : this.laborService.updateLabor(this.editingLaborId, payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(
          this.editingLaborId === null ? 'Labor creada' : 'Labor actualizada'
        );
        this.dialogVisible = false;
        this.cargarLabores();
      },
      error: () => {
        this.toastService.error(
          this.editingLaborId === null ? 'No se pudo crear la labor' : 'No se pudo actualizar la labor'
        );
      },
    });
  }

  eliminarLabor(labor: Labor): void {
    this.confirmService.confirmDelete(
      `Se eliminara la labor ${labor.nombre_labor}. Esta accion no se puede deshacer.`,
      () => {
        this.laborService.deleteLabor(labor.laborId).subscribe({
          next: () => {
            this.toastService.success('Labor eliminada');
            this.labores = this.labores.filter((item) => item.laborId !== labor.laborId);
            this.aplicarFiltros();
          },
          error: () => {
            this.toastService.error('No se pudo eliminar la labor');
          },
        });
      }
    );
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    this.laboresFiltradas = this.labores.filter((labor) => {
      if (this.estadoFiltro && labor.estado !== this.estadoFiltro) {
        return false;
      }

      if (!texto) {
        return true;
      }

      return [
        labor.nombre_labor,
        labor.estado,
        labor.mina_nombre,
        labor.zona_nombre,
        labor.area_nombre,
        labor.fase_nombre,
        labor.tipo_labor_nombre,
        labor.estructura_mineral_nombre,
        labor.nivel_nombre,
        labor.ala_nombre,
      ]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(texto));
    });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.estadoFiltro = '';
    this.aplicarFiltros();
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.editingLaborId = null;
  }

  get tituloDialog(): string {
    return this.editingLaborId === null ? 'Nueva labor' : 'Editar labor';
  }

  get estadoFiltroOptions(): Array<{ label: string; value: string }> {
    const estados = Array.from(new Set(this.labores.map((labor) => labor.estado).filter(Boolean)));
    return [
      { label: 'Todos los estados', value: '' },
      ...estados.map((estado) => ({ label: estado, value: estado })),
    ];
  }

  getUbicacionLabel(labor: Labor): string {
    return [labor.mina_nombre, labor.zona_nombre, labor.area_nombre, labor.fase_nombre]
      .filter(Boolean)
      .join(' / ');
  }

  getClasificacionLabel(labor: Labor): string {
    return [labor.tipo_labor_nombre, labor.estructura_mineral_nombre, labor.nivel_nombre, labor.ala_nombre]
      .filter(Boolean)
      .join(' / ');
  }

  private crearFormularioInicial(): LaborForm {
    return {
      mina_id: null,
      zona_id: null,
      area_id: null,
      fase_id: null,
      tipo_labor_id: null,
      estructura_mineral_id: null,
      nivel_id: null,
      ala_id: null,
      nombre_labor: '',
      estado: '',
    };
  }

  private construirPayload(): LaborPayload | null {
    const payload: LaborPayload = {
      mina_id: this.normalizarNumero(this.form.mina_id) ?? -1,
      zona_id: this.normalizarNumero(this.form.zona_id) ?? -1,
      area_id: this.normalizarNumero(this.form.area_id) ?? -1,
      fase_id: this.normalizarNumero(this.form.fase_id) ?? -1,
      tipo_labor_id: this.normalizarNumero(this.form.tipo_labor_id) ?? -1,
      estructura_mineral_id: this.normalizarNumero(this.form.estructura_mineral_id) ?? -1,
      nivel_id: this.normalizarNumero(this.form.nivel_id) ?? -1,
      ala_id: this.normalizarNumero(this.form.ala_id) ?? -1,
      nombre_labor: this.form.nombre_labor.trim(),
      estado: this.form.estado.trim(),
    };

    return Object.values(payload).some((valor) => valor === -1 || valor === '') ? null : payload;
  }

  private normalizarNumero(valor: unknown): number | null {
    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    const numero = Number(valor);
    return Number.isNaN(numero) ? null : numero;
  }
}
