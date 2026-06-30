import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Labor } from '../../../../models/Labor';
import { Periodo } from '../../../../models/Periodo';
import { PlanAvanceTH } from '../../../../models/PlanAvanceTH';
import { Proceso } from '../../../../models/Proceso';
import { ConfirmService } from '../../../../services/confirm.service';
import {
  PlanAvanceTHPayload,
  PlanesService,
  PlanImportResult,
} from '../../../../services/planes.service';
import { ProcesosService } from '../../../../services/procesos.service';
import { ToastService } from '../../../../services/toast.service';

type PlanAvanceThView = Omit<PlanAvanceTH, 'created_at' | 'updated_at'> & {
  created_at: Date | string | null;
  updated_at: Date | string | null;
};

type PlanAvanceThForm = {
  labor_id: number | null;
  periodo_id: number | null;
  proceso_id: number | null;
  avance_metros: number | null;
  ancho_metros: number | null;
  alto_metros: number | null;
  tms: number | null;
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
  private readonly planesService = inject(PlanesService);
  private readonly procesosService = inject(ProcesosService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toastService = inject(ToastService);

  planes: PlanAvanceThView[] = [];
  planesFiltrados: PlanAvanceThView[] = [];
  labores: Labor[] = [];
  periodos: Periodo[] = [];
  procesos: Proceso[] = [];

  loading = false;
  loadingCatalogos = false;
  saving = false;
  uploadingExcel = false;
  dialogVisible = false;
  editingPlanId: number | null = null;

  busqueda = '';
  procesoFiltro = '';
  periodoFiltro: number | '' = '';

  excelSeleccionado: File | null = null;
  resultadoImportacion: PlanImportResult | null = null;

  form: PlanAvanceThForm = this.crearFormularioInicial();

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargarCatalogos();
    this.cargarPlanes();
  }

  cargarCatalogos(): void {
    this.loadingCatalogos = true;

    forkJoin({
      labores: this.planesService.getLabores(),
      periodos: this.planesService.getPeriodos(),
      procesos: this.procesosService.getProcesos(),
    })
      .pipe(finalize(() => (this.loadingCatalogos = false)))
      .subscribe({
        next: ({ labores, periodos, procesos }) => {
          this.labores = labores;
          this.periodos = periodos;
          this.procesos = procesos;
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error('No se pudieron cargar los catalogos de apoyo');
        },
      });
  }

  cargarPlanes(periodoId?: number | null): void {
    this.loading = true;
    this.planesService
      .getPlanesAvanceTH(periodoId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (planes) => {
          this.planes = planes.map((plan) => this.normalizarPlan(plan));
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error(
            'No se pudieron cargar los planes de avance TH',
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
      proceso_id: plan.proceso_id,
      avance_metros: this.normalizarNumero(plan.avance_metros),
      ancho_metros: this.normalizarNumero(plan.ancho_metros),
      alto_metros: this.normalizarNumero(plan.alto_metros),
      tms: this.normalizarNumero(plan.tms),
    };
    this.dialogVisible = true;
  }

  guardarPlan(): void {
    const payload = this.construirPayload();

    if (!payload) {
      this.toastService.warn(
        'Campos requeridos',
        'Completa labor, periodo, proceso, avance, ancho, alto y tms antes de guardar.',
      );
      return;
    }

    this.saving = true;

    const request = this.editingPlanId === null
      ? this.planesService.createPlanAvanceTH(payload)
      : this.planesService.updatePlanAvanceTH(this.editingPlanId, payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(
          this.editingPlanId === null
            ? 'Plan de avance TH creado'
            : 'Plan de avance TH actualizado',
        );
        this.dialogVisible = false;
        this.cargarPlanes(this.periodoFiltro === '' ? null : this.periodoFiltro);
      },
      error: () => {
        this.toastService.error(
          this.editingPlanId === null
            ? 'No se pudo crear el plan de avance TH'
            : 'No se pudo actualizar el plan de avance TH',
        );
      },
    });
  }

  eliminarPlan(plan: PlanAvanceThView): void {
    this.confirmService.confirmDelete(
      `Se eliminara el plan ${plan.planMetrajeAvanceId} de ${plan.labor_nombre}. Esta accion no se puede deshacer.`,
      () => {
        this.planesService.deletePlanAvanceTH(plan.planMetrajeAvanceId).subscribe({
          next: () => {
            this.toastService.success('Plan de avance TH eliminado');
            this.planes = this.planes.filter(
              (item) => item.planMetrajeAvanceId !== plan.planMetrajeAvanceId,
            );
            this.aplicarFiltros();
          },
          error: () => {
            this.toastService.error('No se pudo eliminar el plan de avance TH');
          },
        });
      },
    );
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    this.planesFiltrados = this.planes.filter((plan) => {
      const proceso = plan.proceso_nombre;
      const periodo = this.getPeriodoLabel(plan.periodo_id);

      if (this.procesoFiltro && proceso !== this.procesoFiltro) {
        return false;
      }

      if (!texto) {
        return true;
      }

      return [
        plan.labor_nombre,
        plan.mina_nombre,
        plan.zona_nombre,
        plan.area_nombre,
        plan.fase_nombre,
        plan.tipo_labor_nombre,
        plan.estructura_mineral_nombre,
        plan.nivel_nombre,
        plan.ala_nombre ?? '',
        proceso,
        periodo,
        String(plan.avance_metros),
        String(plan.ancho_metros),
        String(plan.alto_metros),
        String(plan.tms),
      ]
        .filter(Boolean)
        .some((valor) => String(valor).toLowerCase().includes(texto));
    });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.procesoFiltro = '';
    this.periodoFiltro = '';
    this.cargarPlanes();
  }

  onPeriodoFiltroChange(): void {
    this.cargarPlanes(this.periodoFiltro === '' ? null : this.periodoFiltro);
  }

  abrirSelectorExcel(input: HTMLInputElement): void {
    input.value = '';
    input.click();
  }

  onExcelSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;

    if (!archivo) {
      this.excelSeleccionado = null;
      return;
    }

    const extensionValida = /\.(xlsx|xls)$/i.test(archivo.name);

    if (!extensionValida) {
      this.excelSeleccionado = null;
      input.value = '';
      this.toastService.warn(
        'Archivo no valido',
        'Selecciona un archivo Excel con extension .xlsx o .xls.',
      );
      return;
    }

    this.excelSeleccionado = archivo;
    this.resultadoImportacion = null;
    this.toastService.success('Excel seleccionado', archivo.name);
  }

  enviarExcel(): void {
    if (!this.excelSeleccionado) {
      this.toastService.warn(
        'Archivo requerido',
        'Primero selecciona un archivo Excel para continuar.',
      );
      return;
    }

    this.uploadingExcel = true;

    this.planesService
      .importarExcelPlanAvanceTH(this.excelSeleccionado)
      .pipe(finalize(() => (this.uploadingExcel = false)))
      .subscribe({
        next: (resultado) => {
          this.resultadoImportacion = resultado;
          this.procesarResultadoImportacion(resultado);
          this.cargarPlanes(this.periodoFiltro === '' ? null : this.periodoFiltro);
        },
        error: (error) => {
          this.resultadoImportacion = {
            processed_rows: 0,
            updated_rows: 0,
            skipped_rows: 0,
            errors: this.extraerErroresImportacion(error),
          };

          this.toastService.error(
            'No se pudo importar el Excel',
            'Verifica el archivo y la respuesta del backend.',
          );
        },
      });
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.editingPlanId = null;
  }

  get tituloDialog(): string {
    return this.editingPlanId === null
      ? 'Nuevo plan de avance TH'
      : 'Editar plan de avance TH';
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

  get procesoOptions(): Array<{ label: string; value: number }> {
    return this.procesos.map((proceso) => ({
      label: proceso.nombre,
      value: proceso.id,
    }));
  }

  get procesoFiltroOptions(): Array<{ label: string; value: string }> {
    return [
      { label: 'Todos los procesos', value: '' },
      ...this.procesos.map((proceso) => ({ label: proceso.nombre, value: proceso.nombre })),
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
    const periodo = this.periodos.find((item) => item.periodoId === periodoId);
    return periodo ? this.formatearPeriodoLabel(periodo) : `Periodo ${periodoId}`;
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

  getUbicacionLabel(plan: PlanAvanceThView): string {
    return [plan.mina_nombre, plan.zona_nombre, plan.area_nombre, plan.fase_nombre]
      .filter(Boolean)
      .join(' / ');
  }

  getClasificacionLabel(plan: PlanAvanceThView): string {
    return [
      plan.tipo_labor_nombre,
      plan.estructura_mineral_nombre,
      plan.nivel_nombre,
      plan.ala_nombre ?? '',
    ]
      .filter(Boolean)
      .join(' / ');
  }

  private crearFormularioInicial(): PlanAvanceThForm {
    return {
      labor_id: null,
      periodo_id: null,
      proceso_id: null,
      avance_metros: null,
      ancho_metros: null,
      alto_metros: null,
      tms: null,
    };
  }

  private construirPayload(): PlanAvanceTHPayload | null {
    const labor_id = this.form.labor_id;
    const periodo_id = this.form.periodo_id;
    const proceso_id = this.form.proceso_id;
    const avance_metros = this.normalizarNumero(this.form.avance_metros);
    const ancho_metros = this.normalizarNumero(this.form.ancho_metros);
    const alto_metros = this.normalizarNumero(this.form.alto_metros);
    const tms = this.normalizarNumero(this.form.tms);

    if (
      labor_id === null ||
      periodo_id === null ||
      proceso_id === null ||
      avance_metros === null ||
      ancho_metros === null ||
      alto_metros === null ||
      tms === null
    ) {
      return null;
    }

    return {
      labor_id,
      periodo_id,
      proceso_id,
      avance_metros,
      ancho_metros,
      alto_metros,
      tms,
    };
  }

  private procesarResultadoImportacion(resultado: PlanImportResult): void {
    const resumen = `Procesadas: ${resultado.processed_rows}, actualizadas: ${resultado.updated_rows}, omitidas: ${resultado.skipped_rows}`;

    if (resultado.errors.length > 0) {
      this.toastService.warn('Importacion completada con observaciones', resumen);
      return;
    }

    this.toastService.success('Importacion completada', resumen);
  }

  private extraerErroresImportacion(error: unknown): string[] {
    if (
      error &&
      typeof error === 'object' &&
      'error' in error &&
      error.error &&
      typeof error.error === 'object' &&
      'errors' in error.error &&
      Array.isArray(error.error.errors)
    ) {
      return error.error.errors.filter((item): item is string => typeof item === 'string');
    }

    return ['No se pudo procesar la importacion del Excel.'];
  }

  private formatearPeriodoLabel(periodo: Periodo): string {
    const tipo = periodo.tipo?.trim() || 'PERIODO';
    const numero = periodo.numero;
    const anno = periodo.anno;
    const inicio = this.formatearFechaCorta(periodo.fecha_inicio);
    const fin = this.formatearFechaCorta(periodo.fecha_fin);

    const encabezado = [tipo, numero !== null ? numero : null, anno !== null ? anno : null]
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

  private normalizarPlan(plan: PlanAvanceTH): PlanAvanceThView {
    return {
      ...plan,
      created_at: this.normalizarFecha(plan.created_at),
      updated_at: this.normalizarFecha(plan.updated_at),
    };
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

  private normalizarNumero(valor: unknown): number | null {
    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    const numero = Number(valor);
    return Number.isNaN(numero) ? null : numero;
  }
}
