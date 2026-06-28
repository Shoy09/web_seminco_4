import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Periodo } from '../../../../models/Periodo';
import { ConfirmService } from '../../../../services/confirm.service';
import { PeriodoPayload, PeriodoService } from '../../../../services/periodo.service';
import { ToastService } from '../../../../services/toast.service';

type PeriodoView = Omit<Periodo, 'fecha_inicio' | 'fecha_fin' | 'created_at'> & {
  fecha_inicio: Date | string | null;
  fecha_fin: Date | string | null;
  created_at: Date | string | null;
};

type PeriodoForm = {
  tipo: string;
  numero: number | null;
  anno: number | null;
  fecha_inicio: Date | null;
  fecha_fin: Date | null;
};

@Component({
  selector: 'app-periodos-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    DialogModule,
    InputTextModule,
    ProgressSpinnerModule,
    SelectModule,
    TableModule,
  ],
  templateUrl: './periodos-page.component.html',
  styleUrl: './periodos-page.component.css'
})
export class PeriodosPageComponent implements OnInit {
  private readonly periodoService = inject(PeriodoService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);

  periodos: PeriodoView[] = [];
  periodosFiltrados: PeriodoView[] = [];

  loading = false;
  saving = false;
  dialogVisible = false;
  editingPeriodoId: number | null = null;

  busqueda = '';
  tipoFiltro = '';

  readonly tipoOptions = [
    { label: 'MENSUAL', value: 'MENSUAL' },
    { label: 'SEMANAL', value: 'SEMANAL' },
  ];

  form: PeriodoForm = this.crearFormularioInicial();

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.loading = true;
    this.periodoService
      .getPeriodos()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (periodos) => {
          this.periodos = periodos.map((periodo) => this.normalizarPeriodo(periodo));
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error('No se pudieron cargar los periodos');
        },
      });
  }

  abrirNuevoPeriodo(): void {
    this.editingPeriodoId = null;
    this.form = this.crearFormularioInicial();
    this.dialogVisible = true;
  }

  editarPeriodo(periodo: PeriodoView): void {
    this.editingPeriodoId = periodo.periodoId;
    this.form = {
      tipo: periodo.tipo,
      numero: this.normalizarNumero(periodo.numero),
      anno: this.normalizarNumero(periodo.anno),
      fecha_inicio: this.parseFecha(periodo.fecha_inicio),
      fecha_fin: this.parseFecha(periodo.fecha_fin),
    };
    this.dialogVisible = true;
  }

  guardarPeriodo(): void {
    const payload = this.construirPayload();

    if (!payload) {
      this.toastService.warn(
        'Campos requeridos',
        'Completa tipo, numero, año, fecha de inicio y fecha de fin antes de guardar.'
      );
      return;
    }

    this.saving = true;

    const request = this.editingPeriodoId === null
      ? this.periodoService.createPeriodo(payload)
      : this.periodoService.updatePeriodo(this.editingPeriodoId, payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(
          this.editingPeriodoId === null ? 'Periodo creado' : 'Periodo actualizado'
        );
        this.dialogVisible = false;
        this.cargarPeriodos();
      },
      error: () => {
        this.toastService.error(
          this.editingPeriodoId === null ? 'No se pudo crear el periodo' : 'No se pudo actualizar el periodo'
        );
      },
    });
  }

  eliminarPeriodo(periodo: PeriodoView): void {
    this.confirmService.confirmDelete(
      `Se eliminara el periodo ${this.getPeriodoLabel(periodo)}. Esta accion no se puede deshacer.`,
      () => {
        this.periodoService.deletePeriodo(periodo.periodoId).subscribe({
          next: () => {
            this.toastService.success('Periodo eliminado');
            this.periodos = this.periodos.filter((item) => item.periodoId !== periodo.periodoId);
            this.aplicarFiltros();
          },
          error: () => {
            this.toastService.error('No se pudo eliminar el periodo');
          },
        });
      }
    );
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    this.periodosFiltrados = this.periodos.filter((periodo) => {
      if (this.tipoFiltro && periodo.tipo !== this.tipoFiltro) {
        return false;
      }

      if (!texto) {
        return true;
      }

      return [periodo.tipo, String(periodo.numero), String(periodo.anno), this.getPeriodoLabel(periodo)]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(texto));
    });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.tipoFiltro = '';
    this.aplicarFiltros();
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.editingPeriodoId = null;
  }

  get tituloDialog(): string {
    return this.editingPeriodoId === null ? 'Nuevo periodo' : 'Editar periodo';
  }

  get tipoFiltroOptions(): Array<{ label: string; value: string }> {
    return [{ label: 'Todos los tipos', value: '' }, ...this.tipoOptions];
  }

  getPeriodoLabel(periodo: PeriodoView): string {
    const inicio = this.formatearFechaCorta(periodo.fecha_inicio);
    const fin = this.formatearFechaCorta(periodo.fecha_fin);
    return `${periodo.tipo} ${periodo.numero} ${periodo.anno} (${inicio} - ${fin})`;
  }

  getFechaLabel(fecha: Date | string | null): string {
    return this.formatearFechaCorta(fecha) || 'Sin fecha';
  }

  private crearFormularioInicial(): PeriodoForm {
    return {
      tipo: 'MENSUAL',
      numero: null,
      anno: null,
      fecha_inicio: null,
      fecha_fin: null,
    };
  }

  private construirPayload(): PeriodoPayload | null {
    const tipo = this.form.tipo.trim();
    const numero = this.normalizarNumero(this.form.numero);
    const anno = this.normalizarNumero(this.form.anno);
    const fecha_inicio = this.formatearFecha(this.form.fecha_inicio);
    const fecha_fin = this.formatearFecha(this.form.fecha_fin);

    if (!tipo || numero === null || anno === null || !fecha_inicio || !fecha_fin) {
      return null;
    }

    return { tipo, numero, anno, fecha_inicio, fecha_fin };
  }

  private normalizarPeriodo(periodo: Periodo): PeriodoView {
    return {
      ...periodo,
      fecha_inicio: this.normalizarFecha(periodo.fecha_inicio),
      fecha_fin: this.normalizarFecha(periodo.fecha_fin),
      created_at: this.normalizarFecha(periodo.created_at),
    };
  }

  private normalizarNumero(valor: unknown): number | null {
    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    const numero = Number(valor);
    return Number.isNaN(numero) ? null : numero;
  }

  private normalizarFecha(valor: unknown): Date | string | null {
    if (!valor) {
      return null;
    }

    if (valor instanceof Date) {
      return Number.isNaN(valor.getTime()) ? null : valor;
    }

    return typeof valor === 'string' ? valor : null;
  }

  private parseFecha(valor: Date | string | null): Date | null {
    if (!valor) {
      return null;
    }

    if (valor instanceof Date) {
      return Number.isNaN(valor.getTime()) ? null : valor;
    }

    const iso = /^\d{4}-\d{2}-\d{2}$/.test(valor) ? `${valor}T00:00:00` : valor;
    const parsed = new Date(iso);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private formatearFecha(valor: Date | null): string | null {
    if (!valor) {
      return null;
    }

    const year = valor.getFullYear();
    const month = String(valor.getMonth() + 1).padStart(2, '0');
    const day = String(valor.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatearFechaCorta(valor: Date | string | null): string {
    if (!valor) {
      return '';
    }

    if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return valor;
    }

    const parsed = this.parseFecha(valor);
    return parsed ? this.formatearFecha(parsed) ?? '' : typeof valor === 'string' ? valor : '';
  }
}
