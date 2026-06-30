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
import { ConfirmService } from '../../../../services/confirm.service';
import { ToastService } from '../../../../services/toast.service';
import { PlanProduccion } from '../../../../models/PlanProduccion';
import { Periodo } from '../../../../models/Periodo';
import {
  PlanesService,
  PlanImportResult,
  PlanProduccionPayload,
} from '../../../../services/planes.service';

type PlanProduccionView = Omit<PlanProduccion, 'created_at' | 'updated_at'> & {
  created_at: Date | string | null;
  updated_at: Date | string | null;
};

type PlanProduccionForm = {
  anio: number | null;
  mes: string;
  semana: string;
  mina: string;
  zona: string;
  area: string;
  fase: string;
  tipo_minado: string;
  tipo_labor: string;
  estructura_mineralizada: string;
  nivel: string;
  nombre_labor: string;
  ala: string;
  ancho_veta_metros: number | null;
  ancho_minado_sem_metros: number | null;
  ancho_minado_mes_metros: number | null;
  ag_gr: number | null;
  porcentaje_cu: number | null;
  porcentaje_pb: number | null;
  porcentaje_zn: number | null;
  vpt_actual: number | null;
  vpt_final: number | null;
  cut_off_1: number | null;
  cut_off_2: number | null;
};

@Component({
  selector: 'app-plan-produccion-page',
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
  templateUrl: './plan-produccion-page.component.html',
  styleUrl: './plan-produccion-page.component.css',
})
export class PlanProduccionPageComponent implements OnInit {
  private readonly planesService = inject(PlanesService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toastService = inject(ToastService);

  planes: PlanProduccionView[] = [];
  planesFiltrados: PlanProduccionView[] = [];
  periodos: Periodo[] = [];

  loading = false;
  loadingCatalogos = false;
  saving = false;
  uploadingExcel = false;
  dialogVisible = false;
  editingPlanId: number | null = null;

  busqueda = '';
  periodoFiltro: number | '' = '';

  excelSeleccionado: File | null = null;
  resultadoImportacion: PlanImportResult | null = null;

  form: PlanProduccionForm = this.crearFormularioInicial();

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
      periodos: this.planesService.getPeriodos(),
    })
      .pipe(finalize(() => (this.loadingCatalogos = false)))
      .subscribe({
        next: ({ periodos }) => {
          this.periodos = periodos;
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
      .getPlanesProduccion(periodoId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (planes) => {
          this.planes = planes.map((plan) => this.normalizarPlan(plan));
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error(
            'No se pudieron cargar los planes de produccion',
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

  editarPlan(plan: PlanProduccionView): void {
    this.editingPlanId = plan.planProduccionId;
    this.form = {
      anio: null,
      mes: '',
      semana: '',
      mina: plan.mina_nombre,
      zona: plan.zona_nombre,
      area: plan.area_nombre,
      fase: plan.fase_nombre,
      tipo_minado: '',
      tipo_labor: plan.tipo_labor_nombre,
      estructura_mineralizada: plan.estructura_mineral_nombre,
      nivel: plan.nivel_nombre,
      nombre_labor: plan.labor_nombre,
      ala: plan.ala_nombre ?? '',
      ancho_veta_metros: this.normalizarNumero(plan.ancho_veta_metros),
      ancho_minado_sem_metros: this.normalizarNumero(plan.ancho_minado_sem_metros),
      ancho_minado_mes_metros: this.normalizarNumero(plan.ancho_minado_mes_metros),
      ag_gr: this.normalizarNumero(plan.ag_gr),
      porcentaje_cu: this.normalizarNumero(plan.porcentaje_cu),
      porcentaje_pb: this.normalizarNumero(plan.porcentaje_pb),
      porcentaje_zn: this.normalizarNumero(plan.porcentaje_zn),
      vpt_actual: this.normalizarNumero(plan.vpt_actual),
      vpt_final: this.normalizarNumero(plan.vpt_final),
      cut_off_1: this.normalizarNumero(plan.cut_off_1),
      cut_off_2: this.normalizarNumero(plan.cut_off_2),
    };
    this.dialogVisible = true;
  }

  guardarPlan(): void {
    const payload = this.construirPayload();

    if (!payload) {
      this.toastService.warn(
        'Campos requeridos',
        'Completa año, mes, semana, mina, zona, area, fase, tipo minado, tipo labor, estructura mineralizada, nivel, nombre de labor, ala y las metricas de produccion antes de guardar.',
      );
      return;
    }

    this.saving = true;

    const request = this.editingPlanId === null
      ? this.planesService.createPlanProduccion(payload)
      : this.planesService.updatePlanProduccion(this.editingPlanId, payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(
          this.editingPlanId === null
            ? 'Plan de produccion creado'
            : 'Plan de produccion actualizado',
        );
        this.dialogVisible = false;
        this.cargarPlanes(this.periodoFiltro === '' ? null : this.periodoFiltro);
      },
      error: () => {
        this.toastService.error(
          this.editingPlanId === null
            ? 'No se pudo crear el plan de produccion'
            : 'No se pudo actualizar el plan de produccion',
        );
      },
    });
  }

  eliminarPlan(plan: PlanProduccionView): void {
    this.confirmService.confirmDelete(
      `Se eliminara el plan ${plan.planProduccionId} de ${plan.labor_nombre}. Esta accion no se puede deshacer.`,
      () => {
        this.planesService.deletePlanProduccion(plan.planProduccionId).subscribe({
          next: () => {
            this.toastService.success('Plan de produccion eliminado');
            this.planes = this.planes.filter(
              (item) => item.planProduccionId !== plan.planProduccionId,
            );
            this.aplicarFiltros();
          },
          error: () => {
            this.toastService.error('No se pudo eliminar el plan de produccion');
          },
        });
      },
    );
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    this.planesFiltrados = this.planes.filter((plan) => {
      const periodo = this.getPeriodoLabel(plan.periodo_id);

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
        periodo,
        String(plan.ancho_veta_metros),
        String(plan.ancho_minado_sem_metros),
        String(plan.ancho_minado_mes_metros),
        String(plan.ag_gr),
        String(plan.porcentaje_cu),
        String(plan.porcentaje_pb),
        String(plan.porcentaje_zn ?? ''),
        String(plan.vpt_actual),
        String(plan.vpt_final),
        String(plan.cut_off_1),
        String(plan.cut_off_2),
      ]
        .filter(Boolean)
        .some((valor) => String(valor).toLowerCase().includes(texto));
    });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
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
      .importarExcelPlanProduccion(this.excelSeleccionado)
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
      ? 'Nuevo plan de produccion'
      : 'Editar plan de produccion';
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

  getUbicacionLabel(plan: PlanProduccionView): string {
    return [plan.mina_nombre, plan.zona_nombre, plan.area_nombre, plan.fase_nombre]
      .filter(Boolean)
      .join(' / ');
  }

  getClasificacionLabel(plan: PlanProduccionView): string {
    return [
      plan.tipo_labor_nombre,
      plan.estructura_mineral_nombre,
      plan.nivel_nombre,
      plan.ala_nombre ?? '',
    ]
      .filter(Boolean)
      .join(' / ');
  }

  private crearFormularioInicial(): PlanProduccionForm {
    return {
      anio: null,
      mes: '',
      semana: '',
      mina: '',
      zona: '',
      area: '',
      fase: '',
      tipo_minado: '',
      tipo_labor: '',
      estructura_mineralizada: '',
      nivel: '',
      nombre_labor: '',
      ala: '',
      ancho_veta_metros: null,
      ancho_minado_sem_metros: null,
      ancho_minado_mes_metros: null,
      ag_gr: null,
      porcentaje_cu: null,
      porcentaje_pb: null,
      porcentaje_zn: null,
      vpt_actual: null,
      vpt_final: null,
      cut_off_1: null,
      cut_off_2: null,
    };
  }

  private construirPayload(): PlanProduccionPayload | null {
    const anio = this.normalizarNumero(this.form.anio);
    const ancho_veta_metros = this.normalizarNumero(this.form.ancho_veta_metros);
    const ancho_minado_sem_metros = this.normalizarNumero(this.form.ancho_minado_sem_metros);
    const ancho_minado_mes_metros = this.normalizarNumero(this.form.ancho_minado_mes_metros);
    const ag_gr = this.normalizarNumero(this.form.ag_gr);
    const porcentaje_cu = this.normalizarNumero(this.form.porcentaje_cu);
    const porcentaje_pb = this.normalizarNumero(this.form.porcentaje_pb);
    const vpt_actual = this.normalizarNumero(this.form.vpt_actual);
    const vpt_final = this.normalizarNumero(this.form.vpt_final);
    const cut_off_1 = this.normalizarNumero(this.form.cut_off_1);
    const cut_off_2 = this.normalizarNumero(this.form.cut_off_2);

    if (
      anio === null ||
      ancho_veta_metros === null ||
      ancho_minado_sem_metros === null ||
      ancho_minado_mes_metros === null ||
      ag_gr === null ||
      porcentaje_cu === null ||
      porcentaje_pb === null ||
      vpt_actual === null ||
      vpt_final === null ||
      cut_off_1 === null ||
      cut_off_2 === null ||
      !this.form.mes.trim() ||
      !this.form.semana.trim() ||
      !this.form.mina.trim() ||
      !this.form.zona.trim() ||
      !this.form.area.trim() ||
      !this.form.fase.trim() ||
      !this.form.tipo_minado.trim() ||
      !this.form.tipo_labor.trim() ||
      !this.form.estructura_mineralizada.trim() ||
      !this.form.nivel.trim() ||
      !this.form.nombre_labor.trim() ||
      !this.form.ala.trim()
    ) {
      return null;
    }

    return {
      anio,
      mes: this.form.mes.trim(),
      semana: this.form.semana.trim(),
      mina: this.form.mina.trim(),
      zona: this.form.zona.trim(),
      area: this.form.area.trim(),
      fase: this.form.fase.trim(),
      tipo_minado: this.form.tipo_minado.trim(),
      tipo_labor: this.form.tipo_labor.trim(),
      estructura_mineralizada: this.form.estructura_mineralizada.trim(),
      nivel: this.form.nivel.trim(),
      nombre_labor: this.form.nombre_labor.trim(),
      ala: this.form.ala.trim(),
      ancho_veta_metros,
      ancho_minado_sem_metros,
      ancho_minado_mes_metros,
      ag_gr,
      porcentaje_cu,
      porcentaje_pb,
      porcentaje_zn: this.normalizarNumero(this.form.porcentaje_zn),
      vpt_actual,
      vpt_final,
      cut_off_1,
      cut_off_2,
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

  private normalizarPlan(plan: PlanProduccion): PlanProduccionView {
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
