import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AvanceFaseComponent } from '../Graficos components/Hoja 1/avance-fase/avance-fase.component';
import { DemorasOperativasComponent } from '../Graficos components/Hoja 1/demoras-operativas/demoras-operativas.component';
import { DisparosDiaComponent } from '../Graficos components/Hoja 1/disparos-dia/disparos-dia.component';
import { DisparosEquipoComponent } from '../Graficos components/Hoja 1/disparos-equipo/disparos-equipo.component';
import { HorasDeMantenimientoComponent } from '../Graficos components/Hoja 1/horas-de-mantenimiento/horas-de-mantenimiento.component';
import { HorasNoOperativasComponent } from '../Graficos components/Hoja 1/horas-no-operativas/horas-no-operativas.component';
import { HorometrosJumbosComponent } from '../Graficos components/Hoja 1/horometros-jumbos/horometros-jumbos.component';
import { MetrosPerforadosDisparoComponent } from '../Graficos components/Hoja 1/metros-perforados-disparo/metros-perforados-disparo.component';
import { MhrEquipoComponent } from '../Graficos components/Hoja 1/mhr-equipo/mhr-equipo.component';
import { PerforadoEquipoComponent } from '../Graficos components/Hoja 1/perforado-equipo/perforado-equipo.component';
import { RendimientoEquipoComponent } from '../Graficos components/Hoja 1/rendimiento-equipo/rendimiento-equipo.component';
import { ResumenComponent } from '../Graficos components/Hoja 1/resumen/resumen.component';
import { HorasInicioPerforacionComponent } from '../Graficos components/Hoja 2/horas-inicio-perforacion/horas-inicio-perforacion.component';

import { PlanMensualService } from '../../../../../services/plan-mensual.service';
import { FechasPlanMensualService } from '../../../../../services/fechas-plan-mensual.service';
import { OperacionesService } from '../../../../../services/operaciones.service';

import {
  OperacionBase,
  OperacionBaseJumbo,
} from '../../../../../models/OperacionBase.models';
import { PlanMensual } from '../../../../../models/plan-mensual.model';
import { FormsModule } from '@angular/forms';
import { HistorialInicioPerforacionComponent } from '../Graficos components/Hoja 2/historial-inicio-perforacion/historial-inicio-perforacion.component';
import { HorasFinPerforacionComponent } from '../Graficos components/Hoja 2/horas-fin-perforacion/horas-fin-perforacion.component';
import { HistorialUltimoPerforacionComponent } from '../Graficos components/Hoja 2/historial-ultimo-perforacion/historial-ultimo-perforacion.component';
import { HorasPrimeraPerforacionComponent } from '../Graficos components/Hoja 2/horas-primera-perforacion/horas-primera-perforacion.component';
import { DetallePerforacionComponent } from '../Graficos components/Hoja 2/detalle-perforacion/detalle-perforacion.component';
import { MejoresOperadoresComponent } from '../Graficos components/Hoja 2/mejores-operadores/mejores-operadores.component';
import { ObservacionesComponent } from '../Graficos components/Hoja 2/observaciones/observaciones.component';
import { GanttDiagramComponent } from '../Graficos components/Hoja 2/gantt-diagram/gantt-diagram.component';
import { DisparosTipoPerforacionComponent } from '../Graficos components/Hoja 2/disparos-tipo-perforacion/disparos-tipo-perforacion.component';
import { DetalleDisparosComponent } from '../Graficos components/Hoja 2/detalle-disparos/detalle-disparos.component';
import { RankingOperadorComponent } from '../Graficos components/Hoja 2/ranking-operador/ranking-operador.component';
import { TotalHorometrosComponent } from '../Graficos components/Hoja 1/total-horometros/total-horometros.component';
import { ScatterPlotComponent } from '../Graficos components/Hoja 2/scatter-plot/scatter-plot.component';
import { CommonModule } from '@angular/common';
import { PromedioEstadosEchartsComponent } from '../Graficos components/Hoja 2/promedio-estados-echarts/promedio-estados-echarts.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EstadoService } from '../../../../../services/estado.service';
import { SchedulerComponent } from '../../Linea de tiempo/scheduler/scheduler.component';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import {
  convertirNumero,
  formatearFecha,
} from '../../../../../utils/fecha-utils';
import { GraficaParetoComponent } from '../Graficos components/Hoja 1/grafica-pareto/grafica-pareto.component';
import autoTable from 'jspdf-autotable';
import { MapaDeCalorComponent } from '../Graficos components/Hoja 2/mapa-de-calor/mapa-de-calor.component';
import {
  agregarCabeceraPDF,
  agregarGraficoEchartsPDFProporcional,
  agregarGraficoEnPaginaActual,
  agregarPaginaConGraficos2x3,
  agregarPaginaGraficoCompleto,
  agregarTablaContinuaPDF,
  agregarTablaPrimeraPerforacionPDF,
  configurarCabeceraPDF,
  obtenerImagenChart,
  PdfChartConfig,
} from '../../../../../shared/config-pdf';
import { DialogHoraHoraPerforacionComponent } from '../../../../../features/monitoreo-mina/components/dialog-hora-hora-perforacion/dialog-hora-hora-perforacion.component';
import { MatDialog } from '@angular/material/dialog';
import { PresentacionHorizontalDialogComponent } from '../presentacion-dialog/presentacion-dialog.component';
import { OperacionJumbo } from '../../../../../models/OperacionJumbo';

@Component({
  selector: 'app-principal-grafico-horizontal',
  imports: [
    AvanceFaseComponent,
    ResumenComponent,
    DisparosEquipoComponent,
    DisparosDiaComponent,
    RendimientoEquipoComponent,
    DemorasOperativasComponent,
    HorasNoOperativasComponent,
    HorasDeMantenimientoComponent,
    MetrosPerforadosDisparoComponent,
    PerforadoEquipoComponent,
    MhrEquipoComponent,
    HorometrosJumbosComponent,
    FormsModule,
    HorasPrimeraPerforacionComponent,
    DetallePerforacionComponent,
    MejoresOperadoresComponent,
    ObservacionesComponent,
    //GanttDiagramComponent,
    DisparosTipoPerforacionComponent,
    DetalleDisparosComponent,
    RankingOperadorComponent,
    TotalHorometrosComponent,
    CommonModule,
    PromedioEstadosEchartsComponent,
    GraficaParetoComponent,
    SchedulerComponent,
    DatePickerModule,
    SelectModule,
    SelectButtonModule,
    ButtonModule,
    MapaDeCalorComponent,
    DialogHoraHoraPerforacionComponent,
  ],
  templateUrl: './principal-grafico-horizontal.component.html',
  styleUrl: './principal-grafico-horizontal.component.css',
})
export class PrincipalGraficoHorizontalComponent implements OnInit {
  @ViewChild(DisparosEquipoComponent)
  disparosEquipoChart!: DisparosEquipoComponent;
  @ViewChild(RendimientoEquipoComponent)
  rendimientoEquipoChart!: RendimientoEquipoComponent;
  @ViewChild(DisparosDiaComponent) disparosDiaChart!: DisparosDiaComponent;
  @ViewChildren(GraficaParetoComponent)
  paretoCharts!: QueryList<GraficaParetoComponent>;
  @ViewChild(MetrosPerforadosDisparoComponent)
  metrosDisparoChart!: MetrosPerforadosDisparoComponent;

  @ViewChild(PerforadoEquipoComponent)
  perforadoEquipoChart!: PerforadoEquipoComponent;
  @ViewChild(MhrEquipoComponent) mhrEquipoChart!: MhrEquipoComponent;
  @ViewChild(HorometrosJumbosComponent)
  horometrosJumbosChart!: HorometrosJumbosComponent;
  @ViewChild(TotalHorometrosComponent)
  totalHorometrosChart!: TotalHorometrosComponent;

  @ViewChild(AvanceFaseComponent) avanceFaseChart!: AvanceFaseComponent;
  @ViewChild(DisparosTipoPerforacionComponent)
  disparosTipoPerforacionChart!: DisparosTipoPerforacionComponent;
  @ViewChild(PromedioEstadosEchartsComponent)
  promedioEstadosChart!: PromedioEstadosEchartsComponent;

  @ViewChild(RankingOperadorComponent)
  rankingOperadorChart!: RankingOperadorComponent;

  @ViewChild(MapaDeCalorComponent)
  mapaDeCalorChart!: MapaDeCalorComponent;

  anio!: number;
  mes!: string;

  tiposFiltro = [
    { label: 'Rango', value: 'rango' },
    { label: 'Año', value: 'anio' },
    { label: 'Mes', value: 'mes' },
    { label: 'Semana', value: 'semana' },
    { label: 'Día', value: 'dia' },
  ];

  turnos = [
    { label: 'Todos', value: '' },
    { label: 'Día', value: 'DÍA' },
    { label: 'Noche', value: 'NOCHE' },
  ];

  // Variables para el filtro de fechas
  fechaInicio: string = '';
  fechaFin: string = '';
  tipoFiltro: 'anio' | 'mes' | 'semana' | 'rango' | 'dia' = 'dia';

  anioSeleccionado: Date | null = null;
  mesSeleccionado: Date | null = null;
  semanaSeleccionada: Date | null = null;
  diaSeleccionado: Date | null = null;

  rangoFechas: Date[] | null = null;

  // DATA ORIGINAL (sin filtrar)
  operacionesOriginal: OperacionBaseJumbo[] = [];
  operacionesFiltradas: OperacionBaseJumbo[] = [];
  planesMensuales: PlanMensual[] = [];

  // 🔥 DATA FINAL PARA LOS GRAFICOS
  dataAvanceFase: any[] = [];
  dataDisparosEquipo: any[] = []; // 👈 NUEVO
  dataDisparosDia: any[] = [];
  dataIndicadoresEquipo: any[] = [];
  dataDemorasOperativas: any[] = [];
  DataParetoHorasOperativas: any[] = [];
  DataParetoHorasNoOperativas: any[] = [];
  dataHorasNoOperativas: any[] = [];
  dataHorasMantenimiento: any[] = [];
  DataParetoHorasMantenimiento: any[] = [];
  dataMetrosDisparoFR: any[] = [];
  dataMhrEquipo: any[] = [];
  dataHorometrosJumbos: any[] = [];
  dataPromedioPrimeraPerfDiaFR: any[] = [];
  dataPromedioPrimeraPerfDiaFRPorFecha: any[] = [];
  dataPromedioUltimaPerfDiaFR: any[] = [];
  dataPromedioUltimaPerfDiaFRPorFecha: any[] = [];
  dataProcesoLaborFR: any[] = [];
  dataPercusionConMetrosJumbos: any[] = [];
  dataFrPorOperadorTurno: any[] = [];
  dataLaborFRDetallado: any[] = [];
  dataTipoPerforacion: any[] = [];
  datadetalleDisparos: any[] = [];
  dataHorasNumericas: any[] = [];

  turnoSeleccionado: string = '';
  turnoAplicado: string = '';
  resumen = {
    conteoEquipos: 0,
    metrosPorDisparo: 0,
    nFrentes: 0,
    totalMetros: 0,
  };

  datosGraficoEstados: any[] = [];

  ganttData: any[] = [];
  dataPromedioEstados: any;
  cargandoPDF = false;
  vistaPrincipal: boolean = true;
  estadosProceso: any[] = [];

  ESTADOS_OPERATIVOS = ['201', '202', '203', '204', '205', '207', '208', '211'];
  ESTADOS_NO_OPERATIVOS = [
    '209',
    '210',
    '212',
    '213',
    '214',
    '215',
    '216',
    '217',
  ];

  ESTADOS_MANTENIMIENTO = ['206', '301', '302', '303'];

  constructor(
    private planMensualService: PlanMensualService,
    private fechasPlanMensualService: FechasPlanMensualService,
    private operacionesService: OperacionesService,
    private estadoService: EstadoService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.obtenerUltimaFecha();

    // 🔥 SETEO AUTOMÁTICO
    const hoy = this.getFechaHoy();
    this.fechaInicio = hoy;
    this.fechaFin = hoy;
    this.turnoSeleccionado = this.getTurnoActual();
    this.cargarOperaciones();
    this.obtenerEstadosPorProceso('PERFORACIÓN HORIZONTAL');
  }

  toggleVista() {
    this.vistaPrincipal = !this.vistaPrincipal;
  }

  limpiarFechasPorTipo(): void {
    this.fechaInicio = '';
    this.fechaFin = '';

    this.diaSeleccionado = null;
    this.anioSeleccionado = null;
    this.mesSeleccionado = null;
    this.semanaSeleccionada = null;
    this.rangoFechas = null;
  }

  quitarFiltro(): void {
    this.tipoFiltro = 'rango';

    this.fechaInicio = '';
    this.fechaFin = '';

    this.anioSeleccionado = null;
    this.mesSeleccionado = null;
    this.semanaSeleccionada = null;
    this.rangoFechas = null;

    this.turnoSeleccionado = '';

    // Aquí vuelve a mostrar tu data original.
    // this.dataFiltrada = [...this.dataOriginal];
    this.procesarTodo();
  }

  Presentacion() {
    if (!this.operacionesFiltradas || this.operacionesFiltradas.length === 0) {
      console.warn('No hay datos filtrados para mostrar');
      return;
    }

    const dialogRef = this.dialog.open(PresentacionHorizontalDialogComponent, {
      width: '1800px',
      maxHeight: '90vh',
      data: {
        operaciones: this.operacionesFiltradas,
        turnoAplicado: this.turnoAplicado,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
      },
      disableClose: false,
      autoFocus: true,
    });

    // Opcional: Escuchar cuando se cierre el diálogo
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Diálogo cerrado', result);
    });
  }

  obtenerEstadosPorProceso(proceso: string) {
    this.estadoService.getEstadosByProceso(proceso).subscribe({
      next: (data) => {
        this.estadosProceso = data;
        //console.log('Estados por proceso:', data);

        // 🔥 CLAVE
        this.construirMapaEstados();
      },
      error: (err) => {
        console.error('Error al traer estados por proceso', err);
      },
    });
  }

  private getTurnoActual(): string {
    const hora = new Date().getHours();

    // Día: 07:00 - 18:59
    if (hora >= 7 && hora < 19) {
      return 'DÍA';
    }

    // Noche: 19:00 - 06:59
    return 'NOCHE';
  }

  private getFechaHoy(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // =========================================
  // 🔥 OPERACIONES
  // =========================================
  cargarOperaciones() {
    const tipo = 'tal_horizontal';

    this.operacionesService.getAllAprobados(tipo).subscribe({
      next: (resp) => {
        this.operacionesOriginal = resp.data;

        // 🔥 SOLO ESTO
        this.aplicarFiltro();
      },
      error: (err) => {},
    });
  }

  // =========================================
  // 🔥 FILTRO POR FECHA
  // =========================================
  aplicarFiltro() {
    const fechasValidas = this.calcularRangoFechas();

    if (!fechasValidas) {
      console.warn('Debe seleccionar una fecha válida.');
      return;
    }

    this.turnoAplicado = this.turnoSeleccionado; // 🔥 CLAVE

    this.operacionesFiltradas = this.operacionesOriginal.filter((op) => {
      if (this.fechaInicio && op.fecha < this.fechaInicio) return false;
      if (this.fechaFin && op.fecha > this.fechaFin) return false;

      if (this.turnoAplicado && op.turno !== this.turnoAplicado) return false;

      return true;
    });
    console.log('DATA FILTRADA:', this.operacionesFiltradas);
    this.procesarTodo();
  }

  calcularRangoFechas(): boolean {
    if (this.tipoFiltro === 'anio') {
      if (!this.anioSeleccionado) return false;

      const anio = this.anioSeleccionado.getFullYear();

      this.fechaInicio = `${anio}-01-01`;
      this.fechaFin = `${anio}-12-31`;

      return true;
    }
    if (this.tipoFiltro === 'dia') {
      if (!this.diaSeleccionado) return false;

      const inicio = new Date(this.diaSeleccionado);
      const fin = new Date(this.diaSeleccionado);

      inicio.setHours(0, 0, 0, 0);
      fin.setHours(23, 59, 59, 999);

      this.fechaInicio = this.formatearFecha(inicio);
      this.fechaFin = this.formatearFecha(fin);

      return true;
    }

    if (this.tipoFiltro === 'mes') {
      if (!this.mesSeleccionado) return false;

      const anio = this.mesSeleccionado.getFullYear();
      const mes = this.mesSeleccionado.getMonth();

      const inicio = new Date(anio, mes, 1);
      const fin = new Date(anio, mes + 1, 0);

      this.fechaInicio = formatearFecha(inicio);
      this.fechaFin = formatearFecha(fin);

      return true;
    }

    if (this.tipoFiltro === 'semana') {
      if (!this.semanaSeleccionada) return false;

      const { inicio, fin } = this.obtenerRangoSemana(this.semanaSeleccionada);

      this.fechaInicio = inicio;
      this.fechaFin = fin;

      return true;
    }

    if (this.tipoFiltro === 'rango') {
      if (!this.rangoFechas || this.rangoFechas.length < 2) return false;

      const inicio = this.rangoFechas[0];
      const fin = this.rangoFechas[1];

      if (!inicio || !fin) return false;

      this.fechaInicio = this.formatearFecha(inicio);
      this.fechaFin = this.formatearFecha(fin);

      return true;
    }

    return false;
  }

  obtenerRangoSemana(fecha: Date): { inicio: string; fin: string } {
    const fechaBase = new Date(fecha);

    const dia = fechaBase.getDay();

    const diferenciaLunes = dia === 0 ? -6 : 1 - dia;

    const lunes = new Date(fechaBase);
    lunes.setDate(fechaBase.getDate() + diferenciaLunes);

    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    return {
      inicio: this.formatearFecha(lunes),
      fin: this.formatearFecha(domingo),
    };
  }
  formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  /* quitarFiltro() {
  this.operacionesFiltradas = [...this.operacionesOriginal];
  this.fechaInicio = '';
  this.fechaFin = '';
  this.turnoAplicado = '';
  this.turnoSeleccionado = '';

  this.procesarTodo();
} */

  // =========================================
  // 🔥 PLAN
  // =========================================
  obtenerUltimaFecha(): void {
    this.fechasPlanMensualService.getUltimaFecha().subscribe({
      next: (ultimaFecha) => {
        const anio: number | undefined = ultimaFecha.fecha_ingreso;
        const mes: string = ultimaFecha.mes;

        if (anio !== undefined) {
          this.anio = anio;
          this.mes = mes.trim().toUpperCase();

          this.obtenerPlanesMensuales(this.anio, this.mes);
        }
      },
      error: (error) => {
        //console.error('❌ Error al obtener la última fecha:', error);
      },
    });
  }

  obtenerPlanesMensuales(anio: number, mes: string): void {
    this.planMensualService.getPlanMensualByYearAndMonth(anio, mes).subscribe({
      next: (planes) => {
        this.planesMensuales = planes;
        //console.log('🔥 PLANES MENSUALES:', this.planesMensuales);

        this.procesarTodo();
      },
      error: (error) => {
        //console.error('❌ Error al obtener planes mensuales:', error);
      },
    });
  }

  // =========================================
  // 🔥 PROCESAMIENTO TOTAL
  // =========================================
  procesarTodo() {
    if (!this.operacionesFiltradas.length || !this.planesMensuales.length)
      return;

    this.dataAvanceFase = this.procesarAvanceFase();
    this.dataDisparosEquipo = this.procesarDisparosEquipo(); // 👈 NUEVO
    this.dataDisparosDia = this.procesarDisparosDia();
    this.dataIndicadoresEquipo = this.procesarIndicadoresEquipo();
    this.dataDemorasOperativas = this.procesarDemorasOperativas();
    this.DataParetoHorasOperativas = this.ParetoHorasOperativas();
    this.DataParetoHorasNoOperativas = this.ParetoHorasNoOperativas();
    this.dataHorasNoOperativas = this.procesarHorasNoOperativas();
    this.dataHorasMantenimiento = this.procesarHorasMantenimiento();
    this.DataParetoHorasMantenimiento = this.ParetoHorasMantenimiento();

    this.dataMetrosDisparoFR = this.procesarMetrosPorDisparoFR();
    this.dataMhrEquipo = this.procesarMhrEquipo();
    this.dataHorometrosJumbos = this.procesarHorometrosJumbos();
    this.dataPromedioPrimeraPerfDiaFR = this.procesarPromedioPrimeraPerfDiaFR();
    this.dataPromedioPrimeraPerfDiaFRPorFecha =
      this.procesarPromedioPrimeraPerfDiaFRPorFecha();
    this.dataPromedioUltimaPerfDiaFR = this.procesarPromedioUltimaPerfDiaFR();
    this.dataPromedioUltimaPerfDiaFRPorFecha =
      this.procesarPromedioUltimaPerfDiaFRPorFecha();
    this.dataProcesoLaborFR = this.procesarLaborFR();
    this.dataPercusionConMetrosJumbos = this.procesarPercusionConMetrosJumbos();
    this.dataFrPorOperadorTurno = this.procesarFrPorOperadorTurno();
    this.dataLaborFRDetallado = this.procesarLaborFRDetallado();
    this.dataTipoPerforacion = this.procesarTipoPerforacion();
    this.datadetalleDisparos = this.procesarDataPerforacionDetallada();
    this.dataHorasNumericas = this.procesarHorasNumericas();
    this.procesarResumen();
    this.prepararDatosGraficoEstados();
    this.construirGanttDataNuevo();

    //console.log('🔥 DATA DISPAROS EQUIPO:', this.dataDisparosEquipo);
  }

  // =========================================
  // 🔥 CALCULO DE FRENTES COMPLETOS
  // =========================================
  contarFrentesCompletos(registrosArray: any[]): number {
    if (!Array.isArray(registrosArray)) return 0;

    const tiposValidos = [
      'FRENTE COMPLETO',
      'BREASTING',
      'DESQUINCHE',
      'CIRCADO',
      'REFUGIO',
      'SELLADA',
    ];

    let contador = 0;

    for (const registro of registrosArray) {
      if (registro.estado !== 'OPERATIVO') continue;

      const operacion = registro.operacion || registro;
      const tipo = (operacion?.tipo_perforacion || '').trim().toUpperCase();

      if (tiposValidos.includes(tipo)) {
        contador++;
      }
    }

    return contador;
  }

  contarFrentesPorTipo(registrosArray: any[]): Record<string, number> {
    if (!Array.isArray(registrosArray)) return {};

    const tiposValidos = [
      'FRENTE COMPLETO',
      'BREASTING',
      'DESQUINCHE',
      'CIRCADO',
      'REFUGIO',
      'SELLADA',
    ];

    const conteo: Record<string, number> = {};

    for (const registro of registrosArray) {
      if (registro.estado !== 'OPERATIVO') continue;

      const operacion = registro.operacion || registro;
      const tipo = (operacion?.tipo_perforacion || '').trim().toUpperCase();

      if (tiposValidos.includes(tipo)) {
        conteo[tipo] = (conteo[tipo] || 0) + 1;
      }
    }

    return conteo;
  }

  // =========================================
  // 🔥 OBTENER SECCION DEL PLAN
  // =========================================
  obtenerSeccionDelPlan(area: string): string {
    const plan = this.planesMensuales.find((p) => p.area === area);
    if (plan && plan.ancho_m !== undefined && plan.alto_m !== undefined) {
      return `${plan.ancho_m}x${plan.alto_m}`;
    }
    return '';
  }

  // =========================================
  // 🔥 DATA PARA GRAFICO DISPAROS EQUIPO
  // =========================================
  procesarDisparosEquipo() {
    const mapaDisparos = new Map<
      string,
      {
        modelo_equipo: string;
        seccion: string;
        n_frentes: number;
        tipos: Record<string, number>; // 🔥 nuevo
      }
    >();

    this.operacionesFiltradas.forEach((op) => {
      try {
        const registrosArray = op.registros;

        if (Array.isArray(registrosArray) && registrosArray.length > 0) {
          // 🔥 nuevo: obtener conteo por tipo
          const conteoTipos = this.contarFrentesPorTipo(registrosArray);

          // 🔥 total (por si aún lo necesitas)
          const totalFrentes = Object.values(conteoTipos).reduce(
            (a, b) => a + b,
            0,
          );

          const key = op.modelo_equipo || 'SIN_EQUIPO';

          if (mapaDisparos.has(key)) {
            const existing = mapaDisparos.get(key)!;

            // 🔥 acumular total
            existing.n_frentes += totalFrentes;

            // 🔥 acumular por tipo
            for (const tipo in conteoTipos) {
              existing.tipos[tipo] =
                (existing.tipos[tipo] || 0) + conteoTipos[tipo];
            }
          } else {
            mapaDisparos.set(key, {
              modelo_equipo: op.modelo_equipo || 'SIN_EQUIPO',
              seccion: op.seccion || 'SIN_SECCION',
              n_frentes: totalFrentes,
              tipos: { ...conteoTipos }, // 🔥 inicializar
            });
          }
        }
      } catch (error) {}
    });

    return Array.from(mapaDisparos.values());
  }

  // =========================================
  // 🔥 DISPARO POR DIA
  // =========================================

  procesarDisparosDia() {
    const mapa = new Map<string, number>();

    this.operacionesFiltradas.forEach((op) => {
      try {
        const registrosArray = op.registros;

        if (Array.isArray(registrosArray) && registrosArray.length > 0) {
          const fecha = op.fecha || 'SIN_FECHA';
          const turno = op.turno || 'SIN_TURNO';

          // 🔥 KEY SEGURA (NO ROMPE FECHA)
          const key = `${fecha}|${turno}`;

          const nFrentes = this.contarFrentesCompletos(registrosArray);

          if (mapa.has(key)) {
            mapa.set(key, mapa.get(key)! + nFrentes);
          } else {
            mapa.set(key, nFrentes);
          }
        }
      } catch (error) {
        // console.error(...)
      }
    });

    // 🔥 OUTPUT FINAL
    return Array.from(mapa.entries())
      .map(([key, n_frentes]) => {
        const [fecha, turno] = key.split('|');

        return {
          fecha,
          turno,
          n_frentes,
        };
      })
      .sort((a, b) => {
        // orden seguro por fecha + turno
        const diff = a.fecha.localeCompare(b.fecha);
        return diff !== 0 ? diff : a.turno.localeCompare(b.turno);
      });
  }

  private obtenerMetrosPerforadosRegistro(operacion: OperacionJumbo): number {
    if (!operacion) return 0;

    const talProd = convertirNumero(operacion.tal_prod);
    const talRimados = convertirNumero(operacion.tal_rimados);
    const talAlivio = convertirNumero(operacion.tal_alivio);
    const talRepaso = convertirNumero(operacion.tal_repaso);

    const longBarras = convertirNumero(operacion.long_barras);

    const totalTaladros = talProd + talRimados + talAlivio + talRepaso;

    const metrosPerforados = totalTaladros * longBarras * 0.3048;

    return Number(metrosPerforados.toFixed(2));
  }

  // =========================================
  // 🔥 CALCULO METROS
  // =========================================
  calcularMetrosPerforados(registrosArray: any[]): number {
    //console.log('=== INICIO calcularMetrosPerforados ===');

    if (!Array.isArray(registrosArray)) {
      //console.error('No es un array, es:', typeof registrosArray, registrosArray);
      return 0;
    }

    let totalMetros = 0;

    for (const registro of registrosArray) {
      if (registro.estado !== 'OPERATIVO') {
        continue;
      }

      totalMetros += this.obtenerMetrosPerforadosRegistro(registro.operacion);
    }
    return totalMetros;
  }

  // =========================================
  // 🔥 FILTRAR FASES DEL PLAN
  // =========================================
  private crearMapaPlanes(): Map<string, string> {
    const mapa = new Map<string, string>();

    this.planesMensuales.forEach((p) => {
      const labor_fr = this.construirLaborFR(p.tipo_labor, p.labor, p.ala);

      if (!p.fase) return;

      // clave: labor_fr → valor: fase
      mapa.set(labor_fr, p.fase);
    });

    return mapa;
  }

  // =========================================
  // 🔥 DATA PARA GRAFICO AVANCE FASE
  // =========================================
  procesarAvanceFase() {
    const mapaFases = this.crearMapaPlanes();

    const result: any[] = [];

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      registrosArray.forEach((r) => {
        const operacion = r?.operacion || {};

        const labor_fr = this.construirLaborFR(
          operacion?.tipo_labor,
          operacion?.labor,
          operacion?.ala,
        );

        // 🔥 JOIN con plan
        const fase = mapaFases.get(labor_fr);

        if (!fase) return; // solo los válidos del plan

        const metros = this.calcularMetrosPerforados([r]);

        result.push({
          modelo_equipo: op.modelo_equipo,
          fase,
          labor_fr,
          metros,
        });
      });
    });

    return result;
  }

  private construirLaborFR(tipo_labor: any, labor: any, ala: any): string {
    return `${tipo_labor ?? ''}${labor ?? ''}${ala ?? ''}`.trim();
  }

  // =========================================
  // SEGUNDO GRAFICO - RESUMEN
  // =========================================
  procesarResumen() {
    let totalMetros = 0;
    let totalFrentes = 0;
    const equiposSet = new Set<string>();

    this.operacionesFiltradas.forEach((op, index) => {
      if (op.modelo_equipo) {
        equiposSet.add(op.modelo_equipo);
      }

      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) {
        console.warn(`⚠️ Operación ${index} sin registros`);
        return;
      }

      // 🔹 Metros
      const metros = this.calcularMetrosPerforados(registrosArray);
      totalMetros += metros;

      // 🔹 Frentes por operación
      const frentes = this.contarFrentesCompletos(registrosArray);
      totalFrentes += frentes;
    });

    const metrosPorDisparo = totalFrentes > 0 ? totalMetros / totalFrentes : 0;

    this.resumen = {
      conteoEquipos: equiposSet.size,
      metrosPorDisparo: Number(metrosPorDisparo.toFixed(0)),
      nFrentes: totalFrentes,
      totalMetros: Number(totalMetros.toFixed(0)),
    };
  }

  //=========================================
  // 🔥 GRAFICO 5
  // =========================================

  procesarIndicadoresEquipo() {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      try {
        const registros = op.registros;
        if (!Array.isArray(registros)) return;

        const key = op.modelo_equipo || 'SIN_EQUIPO';

        const mantenimiento = this.calcularDuracionPorEstado(
          registros,
          'MANTENIMIENTO',
        );
        const demoras206 = this.calcularDuracionPorEstado(
          registros,
          'DEMORA',
          '206',
        );

        const horasMantenimiento = mantenimiento + demoras206;

        const horasTrabajadas = this.calcularHorasTrabajadas(op);

        if (mapa.has(key)) {
          const acc = mapa.get(key);

          acc.n_operaciones += 1;
          acc.horas_mantenimiento += horasMantenimiento;
          acc.horas_trabajadas += horasTrabajadas;
        } else {
          mapa.set(key, {
            modelo_equipo: key,
            seccion: op.seccion || 'SIN_SECCION',

            n_operaciones: 1,
            horas_mantenimiento: horasMantenimiento,
            horas_trabajadas: horasTrabajadas,
          });
        }
      } catch (error) {}
    });

    return Array.from(mapa.values()).map((item) => {
      const horasProgramadas = item.n_operaciones * 10;

      // ✅ DM_FR (como DAX)
      const horasMantenimientoAjustado_dm =
        item.horas_mantenimiento === 0
          ? 0.5 * item.n_operaciones
          : item.horas_mantenimiento;

      const dm_fr =
        horasProgramadas > 0
          ? (horasProgramadas - horasMantenimientoAjustado_dm) /
            horasProgramadas
          : 0;

      // ✅ UTI_FR (como DAX)
      const horasMantenimientoAjustado_uti =
        item.horas_mantenimiento === 0 ? 0.5 : item.horas_mantenimiento;

      const denominador = horasProgramadas - horasMantenimientoAjustado_uti;

      const uti_fr = denominador > 0 ? item.horas_trabajadas / denominador : 0;

      return {
        modelo_equipo: item.modelo_equipo,
        seccion: item.seccion,

        DM_FR: Number(dm_fr.toFixed(3)),
        UTI_FR: Number(uti_fr.toFixed(3)),
      };
    });
  }

  calcularDuracionHoras(horaInicio: string, horaFinal: string): number {
    if (!horaInicio || !horaFinal) return 0;

    const [h1, m1] = horaInicio.split(':').map(Number);
    const [h2, m2] = horaFinal.split(':').map(Number);

    const inicio = h1 * 60 + m1;
    const fin = h2 * 60 + m2;

    return (fin - inicio) / 60; // en horas
  }

  calcularDuracionPorEstado(
    registros: any[],
    estadoBuscado: string,
    codigo?: string,
  ): number {
    let total = 0;

    for (const r of registros) {
      if (r.estado === estadoBuscado) {
        if (codigo && r.codigo !== codigo) continue;

        total += this.calcularDuracionHoras(r.hora_inicio, r.hora_final);
      }
    }

    return total;
  }

  calcularHorasTrabajadas(op: any): number {
    const diesel = op.horometros?.diesel;
    const electrico = op.horometros?.electrico;

    const difDiesel = diesel ? diesel.final - diesel.inicio : 0;
    const difElectrico = electrico ? electrico.final - electrico.inicio : 0;

    return difDiesel + difElectrico;
  }

  // =========================================
  // Grafico 6
  // =========================================
  procesarDemorasOperativas() {
    const mapa = new Map<string, any>();
    const tiposEstados = this.getTiposEstadosMap();
    const equiposUnicos = new Set<string>();

    // 🔹 RECORRER DATA
    this.operacionesFiltradas.forEach((op) => {
      const registros = op.registros;
      if (!Array.isArray(registros)) return;

      // ✅ DISTINCTCOUNT (como DAX: TODOS los equipos)
      if (op.modelo_equipo) {
        equiposUnicos.add(op.modelo_equipo);
      }

      registros.forEach((r) => {
        const tipo = tiposEstados[r.codigo];
        if (!tipo) return;

        const duracion = this.calcularDuracionHoras(
          r.hora_inicio,
          r.hora_final!,
        );

        if (!duracion || duracion <= 0) return;

        if (mapa.has(tipo)) {
          mapa.get(tipo).horas += duracion;
        } else {
          mapa.set(tipo, {
            tipo_estado: tipo,
            horas: duracion,
          });
        }
      });
    });

    const nEquipos = equiposUnicos.size;

    // 🔹 BASE (equivalente a SUMX + DIVIDE)
    let resultado = Array.from(mapa.values())
      .filter((x) => x.horas > 0)
      .map((x) => ({
        tipo_estado: x.tipo_estado,
        horas: x.horas,
        promedio: nEquipos > 0 ? x.horas / nEquipos : 0,
      }));

    // 🔥 ORDEN DESC (RANKX DESC)
    resultado.sort((a, b) => b.horas - a.horas);

    // 🔥 RANK DENSE (igual que DAX)
    let rank = 1;
    resultado = resultado.map((item, index, arr) => {
      if (index > 0 && item.horas < arr[index - 1].horas) {
        rank = index + 1;
      }

      return {
        ...item,
        rank,
      };
    });

    // 🔥 ACUMULADO (Tiempo_Acu_FR)
    let acumulado = 0;
    const totalHoras = resultado.reduce((sum, x) => sum + x.horas, 0);

    resultado = resultado.map((item) => {
      acumulado += item.horas;

      return {
        ...item,
        tiempo_acu: acumulado,
        tiempo_acu_pct: totalHoras > 0 ? acumulado / totalHoras : 0,
      };
    });

    return resultado;
  }
  ParetoHorasOperativas() {
    const resultadoMap = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        const codigo = String(registro.codigo || '').trim();

        if (!codigo) continue;

        // Solo DEMORAS OPERATIVAS
        if (!this.esEstadoOperativoPorCodigo(codigo)) continue;

        if (!registro.hora_inicio || !registro.hora_final) continue;

        const horas = this.calcularDuracionHoras(
          registro.hora_inicio,
          registro.hora_final,
        );

        if (!horas || horas <= 0) continue;

        const actividad = this.obtenerActividadPorCodigo(codigo);

        if (!resultadoMap.has(actividad)) {
          resultadoMap.set(actividad, {
            actividad,
            horasDemora: 0,
            paretoAct: 0,
            porcentajeHoras: 0,
            cantidadRegistros: 0,
            codigos: new Set<string>(),
          });
        }

        const item = resultadoMap.get(actividad);

        item.horasDemora += horas;
        item.cantidadRegistros += 1;
        item.codigos.add(codigo);
      }
    });

    let resultado = Array.from(resultadoMap.values()).map((item) => {
      item.horasDemora = Number(item.horasDemora.toFixed(2));
      item.codigos = Array.from(item.codigos);
      return item;
    });

    // Orden Pareto: mayor HorasDemora primero.
    // Si empatan, orden alfabético por actividad.
    resultado.sort((a, b) => {
      if (b.horasDemora !== a.horasDemora) {
        return b.horasDemora - a.horasDemora;
      }

      return String(a.actividad).localeCompare(String(b.actividad));
    });

    const totalHorasDemora = resultado.reduce(
      (sum, item) => sum + item.horasDemora,
      0,
    );

    let acumulado = 0;

    resultado = resultado.map((item) => {
      acumulado += item.horasDemora;

      item.paretoAct =
        totalHorasDemora > 0
          ? Number(((acumulado / totalHorasDemora) * 100).toFixed(2))
          : 0;

      item.porcentajeHoras =
        totalHorasDemora > 0
          ? Number(((item.horasDemora / totalHorasDemora) * 100).toFixed(2))
          : 0;

      item.totalHorasDemora = Number(totalHorasDemora.toFixed(2));

      return item;
    });

    return resultado;
  }

  ParetoHorasNoOperativas() {
    const resultadoMap = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        const codigo = String(registro.codigo || '').trim();

        if (!codigo) continue;

        // Solo DEMORAS NO OPERATIVAS
        if (!this.esEstadoNoOperativoPorCodigo(codigo)) continue;

        if (!registro.hora_inicio || !registro.hora_final) continue;

        const horas = this.calcularDuracionHoras(
          registro.hora_inicio,
          registro.hora_final,
        );

        if (!horas || horas <= 0) continue;

        const actividad = this.obtenerActividadPorCodigo(codigo);

        if (!resultadoMap.has(actividad)) {
          resultadoMap.set(actividad, {
            actividad,
            horasDemora: 0,
            paretoAct: 0,
            porcentajeHoras: 0,
            cantidadRegistros: 0,
            codigos: new Set<string>(),
          });
        }

        const item = resultadoMap.get(actividad);

        item.horasDemora += horas;
        item.cantidadRegistros += 1;
        item.codigos.add(codigo);
      }
    });

    let resultado = Array.from(resultadoMap.values()).map((item) => {
      item.horasDemora = Number(item.horasDemora.toFixed(2));
      item.codigos = Array.from(item.codigos);
      return item;
    });

    // Orden Pareto: mayor HorasDemora primero.
    // Si empatan, orden alfabético por actividad.
    resultado.sort((a, b) => {
      if (b.horasDemora !== a.horasDemora) {
        return b.horasDemora - a.horasDemora;
      }

      return String(a.actividad).localeCompare(String(b.actividad));
    });

    const totalHorasDemora = resultado.reduce(
      (sum, item) => sum + item.horasDemora,
      0,
    );

    let acumulado = 0;

    resultado = resultado.map((item) => {
      acumulado += item.horasDemora;

      item.paretoAct =
        totalHorasDemora > 0
          ? Number(((acumulado / totalHorasDemora) * 100).toFixed(2))
          : 0;

      item.porcentajeHoras =
        totalHorasDemora > 0
          ? Number(((item.horasDemora / totalHorasDemora) * 100).toFixed(2))
          : 0;

      item.totalHorasDemora = Number(totalHorasDemora.toFixed(2));

      return item;
    });

    return resultado;
  }

  getTiposEstadosMap(): Record<string, string> {
    return {
      '201': 'Falta de Operador',
      '202': 'MpL - mantenimiento preventivo de labor',
      '203': 'Ingreso - Salida',
      '204': 'Charla',
      '205': 'Traslado al equipo',
      '207': 'Refrigerio',
      '208': 'Traslado de equipo',
      '211': 'Instalación de equipo',
    };
  }

  private obtenerActividadPorCodigo(codigo: string): string {
    const estado = this.mapaEstados.get(codigo);

    if (!estado) return `COD ${codigo}`;

    return (
      estado.tipo_estado ||
      estado.categoria ||
      estado.estado_principal ||
      `COD ${codigo}`
    );
  }

  private esEstadoOperativoPorCodigo(codigo: string): boolean {
    return this.ESTADOS_OPERATIVOS.includes(codigo);
  }
  private esEstadoNoOperativoPorCodigo(codigo: string): boolean {
    return this.ESTADOS_NO_OPERATIVOS.includes(codigo);
  }
  private esEstadoMantenimientoPorCodigo(codigo: string): boolean {
    return this.ESTADOS_MANTENIMIENTO.includes(codigo);
  }
  // =========================================
  //GRAFICO 7
  // =========================================

  procesarHorasNoOperativas() {
    const mapa = new Map<string, any>();
    const tiposEstados = this.getTiposEstadosMapNoOperativa();
    const equiposUnicos = new Set<string>();

    // 🔹 RECORRER DATA
    this.operacionesFiltradas.forEach((op) => {
      const registros = op.registros;
      if (!Array.isArray(registros)) return;

      // ✅ DISTINCTCOUNT (como DAX: TODOS los equipos)
      if (op.modelo_equipo) {
        equiposUnicos.add(op.modelo_equipo);
      }

      registros.forEach((r) => {
        const tipo = tiposEstados[r.codigo];
        if (!tipo) return;

        const duracion = this.calcularDuracionHoras(
          r.hora_inicio,
          r.hora_final!,
        );

        if (!duracion || duracion <= 0) return;

        if (mapa.has(tipo)) {
          mapa.get(tipo).horas += duracion;
        } else {
          mapa.set(tipo, {
            tipo_estado: tipo,
            horas: duracion,
          });
        }
      });
    });

    const nEquipos = equiposUnicos.size;

    // 🔹 BASE (equivalente a SUMX + DIVIDE)
    let resultado = Array.from(mapa.values())
      .filter((x) => x.horas > 0)
      .map((x) => ({
        tipo_estado: x.tipo_estado,
        horas: x.horas,
        promedio: nEquipos > 0 ? x.horas / nEquipos : 0,
      }));

    // 🔥 ORDEN DESC (RANKX DESC)
    resultado.sort((a, b) => b.horas - a.horas);

    // 🔥 RANK DENSE (igual que DAX)
    let rank = 1;
    resultado = resultado.map((item, index, arr) => {
      if (index > 0 && item.horas < arr[index - 1].horas) {
        rank = index + 1;
      }

      return {
        ...item,
        rank,
      };
    });

    // 🔥 ACUMULADO (Tiempo_Acu_FR)
    let acumulado = 0;
    const totalHoras = resultado.reduce((sum, x) => sum + x.horas, 0);

    resultado = resultado.map((item) => {
      acumulado += item.horas;

      return {
        ...item,
        tiempo_acu: acumulado,
        tiempo_acu_pct: totalHoras > 0 ? acumulado / totalHoras : 0,
      };
    });

    return resultado;
  }

  getTiposEstadosMapNoOperativa(): Record<string, string> {
    return {
      '209': 'Falta de labor',
      '210': 'Falta de servicios (energía - agua - aire)',
      '212': 'Apoyo en servicios mineros',
      '213': 'Falta de aceros',
      '214': 'Falta de ventilación',
      '215': 'Trabajos varios',
      '216': 'Accidente de equipo',
      '217': 'Recuperación de aceros',
    };
  }

  // =========================================
  //GRAFICO 8
  // =========================================

  procesarHorasMantenimiento() {
    const mapa = new Map<string, any>();
    const tiposEstados = this.getTiposEstadosMantenimiento();
    const equiposUnicos = new Set<string>();

    // 🔹 RECORRER DATA
    this.operacionesFiltradas.forEach((op) => {
      const registros = op.registros;
      if (!Array.isArray(registros)) return;

      // ✅ DISTINCTCOUNT (como DAX: TODOS los equipos)
      if (op.modelo_equipo) {
        equiposUnicos.add(op.modelo_equipo);
      }

      registros.forEach((r) => {
        const tipo = tiposEstados[r.codigo];
        if (!tipo) return;

        const duracion = this.calcularDuracionHoras(
          r.hora_inicio,
          r.hora_final!,
        );

        if (!duracion || duracion <= 0) return;

        if (mapa.has(tipo)) {
          mapa.get(tipo).horas += duracion;
        } else {
          mapa.set(tipo, {
            tipo_estado: tipo,
            horas: duracion,
          });
        }
      });
    });

    const nEquipos = equiposUnicos.size;

    // 🔹 BASE (equivalente a SUMX + DIVIDE)
    let resultado = Array.from(mapa.values())
      .filter((x) => x.horas > 0)
      .map((x) => ({
        tipo_estado: x.tipo_estado,
        horas: x.horas,
        promedio: nEquipos > 0 ? x.horas / nEquipos : 0,
      }));

    // 🔥 ORDEN DESC (RANKX DESC)
    resultado.sort((a, b) => b.horas - a.horas);

    // 🔥 RANK DENSE (igual que DAX)
    let rank = 1;
    resultado = resultado.map((item, index, arr) => {
      if (index > 0 && item.horas < arr[index - 1].horas) {
        rank = index + 1;
      }

      return {
        ...item,
        rank,
      };
    });

    // 🔥 ACUMULADO (Tiempo_Acu_FR)
    let acumulado = 0;
    const totalHoras = resultado.reduce((sum, x) => sum + x.horas, 0);

    resultado = resultado.map((item) => {
      acumulado += item.horas;

      return {
        ...item,
        tiempo_acu: acumulado,
        tiempo_acu_pct: totalHoras > 0 ? acumulado / totalHoras : 0,
      };
    });

    return resultado;
  }

  ParetoHorasMantenimiento() {
    const resultadoMap = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        const codigo = String(registro.codigo || '').trim();

        if (!codigo) continue;

        // Solo MANTENIMIENTO
        if (!this.esEstadoMantenimientoPorCodigo(codigo)) continue;

        if (!registro.hora_inicio || !registro.hora_final) continue;

        const horas = this.calcularDuracionHoras(
          registro.hora_inicio,
          registro.hora_final,
        );

        if (!horas || horas <= 0) continue;

        const actividad = this.obtenerActividadPorCodigo(codigo);

        if (!resultadoMap.has(actividad)) {
          resultadoMap.set(actividad, {
            actividad,
            horasDemora: 0,
            paretoAct: 0,
            porcentajeHoras: 0,
            cantidadRegistros: 0,
            codigos: new Set<string>(),
          });
        }

        const item = resultadoMap.get(actividad);

        item.horasDemora += horas;
        item.cantidadRegistros += 1;
        item.codigos.add(codigo);
      }
    });

    let resultado = Array.from(resultadoMap.values()).map((item) => {
      item.horasDemora = Number(item.horasDemora.toFixed(2));
      item.codigos = Array.from(item.codigos);
      return item;
    });

    // Orden Pareto: mayor HorasDemora primero.
    // Si empatan, orden alfabético por actividad.
    resultado.sort((a, b) => {
      if (b.horasDemora !== a.horasDemora) {
        return b.horasDemora - a.horasDemora;
      }

      return String(a.actividad).localeCompare(String(b.actividad));
    });

    const totalHorasDemora = resultado.reduce(
      (sum, item) => sum + item.horasDemora,
      0,
    );

    let acumulado = 0;

    resultado = resultado.map((item) => {
      acumulado += item.horasDemora;

      item.paretoAct =
        totalHorasDemora > 0
          ? Number(((acumulado / totalHorasDemora) * 100).toFixed(2))
          : 0;

      item.porcentajeHoras =
        totalHorasDemora > 0
          ? Number(((item.horasDemora / totalHorasDemora) * 100).toFixed(2))
          : 0;

      item.totalHorasDemora = Number(totalHorasDemora.toFixed(2));

      return item;
    });

    return resultado;
  }

  getTiposEstadosMantenimiento(): Record<string, string> {
    return {
      '206': 'Inspección de equipo',
      '301': 'Mp inicial/final',
      '302': 'Mantenimiento programado',
      '303': 'Mantenimiento correctivo',
    };
  }

  // =========================================
  //GRAFICO 9
  // =========================================
  procesarMetrosPorDisparoFR() {
    const mapa = new Map<
      string,
      {
        modelo_equipo: string;
        seccion: string;
        n_frentes: number;
        metros_perforados: number;
        m_disparo_fr: number;
      }
    >();

    this.operacionesFiltradas.forEach((op) => {
      try {
        const registrosArray = op.registros;

        if (!Array.isArray(registrosArray) || registrosArray.length === 0)
          return;

        const key = `${op.modelo_equipo || 'SIN_EQUIPO'}-${op.seccion || 'SIN_SECCION'}`;

        const nFrentes = this.contarFrentesCompletos(registrosArray);
        const metros = this.calcularMetrosPerforados(registrosArray);

        if (mapa.has(key)) {
          const existing = mapa.get(key)!;

          existing.n_frentes += nFrentes;
          existing.metros_perforados += metros;
        } else {
          mapa.set(key, {
            modelo_equipo: op.modelo_equipo || 'SIN_EQUIPO',
            seccion: op.seccion || 'SIN_SECCION',
            n_frentes: nFrentes,
            metros_perforados: metros,
            m_disparo_fr: 0, // se calcula después
          });
        }
      } catch (error) {}
    });

    // 🔥 cálculo FINAL estilo DAX
    for (const item of mapa.values()) {
      item.m_disparo_fr =
        item.n_frentes > 0 ? item.metros_perforados / item.n_frentes : 0;
    }

    return Array.from(mapa.values());
  }

  // =========================================
  // GRAFICO 10
  // =========================================

  procesarMhrEquipo() {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const key = op.modelo_equipo || 'SIN_EQUIPO';

      const operativos = registrosArray.filter((r) => r.estado === 'OPERATIVO');

      const metros = this.calcularMetrosPerforados(operativos);

      // 🔥 FIX AQUÍ
      const perc = (op as any)?.horometros?.percusion;

      const inicio = Number(perc?.inicio);
      const final = Number(perc?.final);

      let difPercusion = 0;

      if (!isNaN(inicio) && !isNaN(final)) {
        difPercusion = final - inicio;
      }

      if (!mapa.has(key)) {
        mapa.set(key, {
          modelo_equipo: key,
          metros_perforados: 0,
          dif_percusion: 0,
          fr_mhr_hp: 0,
        });
      }

      const item = mapa.get(key)!;

      item.metros_perforados += metros;
      item.dif_percusion += difPercusion;
    });

    for (const item of mapa.values()) {
      item.fr_mhr_hp =
        item.dif_percusion > 0
          ? item.metros_perforados / item.dif_percusion
          : 0;
    }

    return Array.from(mapa.values());
  }

  // =========================================
  // 🔥 GRAFICO 11
  // =========================================

  procesarHorometrosJumbos() {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const key = op.modelo_equipo || 'SIN_EQUIPO';

      const horo = (op as any)?.horometros;

      const diesel = horo?.diesel;
      const electrico = horo?.electrico;
      const percusion = horo?.percusion;

      const difDiesel =
        !isNaN(Number(diesel?.inicio)) && !isNaN(Number(diesel?.final))
          ? Number(diesel.final) - Number(diesel.inicio)
          : 0;

      const difElectrico =
        !isNaN(Number(electrico?.inicio)) && !isNaN(Number(electrico?.final))
          ? Number(electrico.final) - Number(electrico.inicio)
          : 0;

      const difPercusion =
        !isNaN(Number(percusion?.inicio)) && !isNaN(Number(percusion?.final))
          ? Number(percusion.final) - Number(percusion.inicio)
          : 0;

      if (!mapa.has(key)) {
        mapa.set(key, {
          modelo_equipo: key,
          diesel: 0,
          electrico: 0,
          percusion: 0,
        });
      }

      const item = mapa.get(key)!;

      item.diesel += difDiesel;
      item.electrico += difElectrico;
      item.percusion += difPercusion;
    });

    const result = Array.from(mapa.values());

    return result;
  }

  // =========================================
  // GRAFICO 12
  // =========================================

  procesarPromedioPrimeraPerfDiaFR() {
    const mapa = new Map<string, Map<string, number>>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const key = op.modelo_equipo || 'SIN_EQUIPO';
      const fecha = op.fecha;

      const operativos = registrosArray.filter((r) => r.estado === 'OPERATIVO');

      let primerasHorasDelDia: number[] = [];

      operativos.forEach((r) => {
        const hora = r?.hora_inicio;
        if (!hora) return;

        const [h, m] = hora.split(':').map(Number);
        const horaDecimal = h + m / 60;

        // 🔥 SOLO 07–19
        if (horaDecimal < 7 || horaDecimal >= 19) return;

        primerasHorasDelDia.push(horaDecimal);
      });

      if (primerasHorasDelDia.length === 0) return;

      const primeraHora = Math.min(...primerasHorasDelDia);

      if (!mapa.has(key)) {
        mapa.set(key, new Map());
      }

      const mapaFechas = mapa.get(key)!;

      // solo 1 valor por día
      mapaFechas.set(fecha, primeraHora);
    });

    // =========================
    // 🔥 PROMEDIO FINAL
    // =========================
    const result: any[] = [];

    for (const [equipo, fechasMap] of mapa.entries()) {
      let suma = 0;
      let dias = 0;

      fechasMap.forEach((hora) => {
        suma += hora;
        dias++;
      });

      const promedio = dias > 0 ? suma / dias : 0;

      //console.log(`\n🔥 ${equipo}`);
      //console.log(`días:`, dias);
      //console.log(`promedio primera perf:`, promedio);

      result.push({
        modelo_equipo: equipo,
        promedio_primera_perf_dia_fr: promedio,
      });
    }

    return result;
  }

  // =========================================
  //Grafico 13
  // =========================================

  procesarPromedioPrimeraPerfDiaFRPorFecha() {
    const mapa = new Map<string, Map<string, number>>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const key = op.modelo_equipo || 'SIN_EQUIPO';
      const fecha = op.fecha || 'SIN_FECHA';

      const operativos = registrosArray.filter((r) => r.estado === 'OPERATIVO');

      let primerasHorasDelDia: number[] = [];

      operativos.forEach((r) => {
        const hora = r?.hora_inicio;
        if (!hora) return;

        const [h, m] = hora.split(':').map(Number);
        const horaDecimal = h + m / 60;

        // 🔥 SOLO 07–19
        if (horaDecimal < 7 || horaDecimal >= 19) return;

        primerasHorasDelDia.push(horaDecimal);
      });

      if (primerasHorasDelDia.length === 0) return;

      const primeraHora = Math.min(...primerasHorasDelDia);

      // =========================
      // 🔥 MAPA POR EQUIPO
      // =========================
      if (!mapa.has(key)) {
        mapa.set(key, new Map());
      }

      const mapaFechas = mapa.get(key)!;

      // 🔥 1 valor por equipo por fecha
      mapaFechas.set(fecha, primeraHora);
    });

    // =========================
    // 🔥 FORMATO PARA GRÁFICO
    // =========================
    const result: any[] = [];

    for (const [equipo, fechasMap] of mapa.entries()) {
      fechasMap.forEach((hora, fecha) => {
        result.push({
          fecha,
          modelo_equipo: equipo,
          promedio_primera_perf_dia_fr: hora,
        });
      });
    }

    // 🔥 ordenar por fecha (importante para eje X)
    return result.sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  // =========================================
  // Grafico 14
  // =========================================

  procesarPromedioUltimaPerfDiaFR() {
    const mapa = new Map<string, Map<string, number>>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const key = op.modelo_equipo || 'SIN_EQUIPO';
      const fecha = op.fecha || 'SIN_FECHA';

      const operativos = registrosArray.filter((r) => r.estado === 'OPERATIVO');

      let horasValidas: number[] = [];

      operativos.forEach((r) => {
        const hora = r?.hora_inicio;
        if (!hora) return;

        const [h, m] = hora.split(':').map(Number);
        const horaDecimal = h + m / 60;

        // 🔥 solo 07–19
        if (horaDecimal < 7 || horaDecimal >= 19) return;

        horasValidas.push(horaDecimal);
      });

      if (horasValidas.length === 0) return;

      // 🔥 AQUÍ CAMBIA LA LÓGICA
      const ultimaHora = Math.max(...horasValidas);

      if (!mapa.has(key)) {
        mapa.set(key, new Map());
      }

      const mapaFechas = mapa.get(key)!;

      // 1 valor por día
      mapaFechas.set(fecha, ultimaHora);
    });

    // =========================
    // 🔥 PROMEDIO FINAL
    // =========================
    const result: any[] = [];

    for (const [equipo, fechasMap] of mapa.entries()) {
      let suma = 0;
      let dias = 0;

      fechasMap.forEach((hora) => {
        suma += hora;
        dias++;
      });

      const promedio = dias > 0 ? suma / dias : 0;

      ////console.log(`\n🔥 EQUIPO: ${equipo}`);
      ////console.log(`días:`, dias);
      ////console.log(`promedio última perf:`, promedio);

      result.push({
        modelo_equipo: equipo,
        promedio_ultima_perf_dia_fr: promedio,
      });
    }

    return result;
  }

  // =========================================
  // Grafico 15
  // =========================================

  procesarPromedioUltimaPerfDiaFRPorFecha() {
    const mapa = new Map<string, Map<string, number>>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const key = op.modelo_equipo || 'SIN_EQUIPO';
      const fecha = op.fecha || 'SIN_FECHA';

      const operativos = registrosArray.filter((r) => r.estado === 'OPERATIVO');

      let horasValidas: number[] = [];

      operativos.forEach((r) => {
        const hora = r?.hora_inicio;
        if (!hora) return;

        const [h, m] = hora.split(':').map(Number);
        const horaDecimal = h + m / 60;

        // 🔥 SOLO 07–19
        if (horaDecimal < 7 || horaDecimal >= 19) return;

        horasValidas.push(horaDecimal);
      });

      if (horasValidas.length === 0) return;

      // 🔥 CAMBIO CLAVE: última perforación
      const ultimaHora = Math.max(...horasValidas);

      if (!mapa.has(key)) {
        mapa.set(key, new Map());
      }

      const mapaFechas = mapa.get(key)!;

      // 1 valor por equipo por fecha
      mapaFechas.set(fecha, ultimaHora);
    });

    // =========================
    // 🔥 FORMATO PARA GRÁFICO
    // =========================
    const result: any[] = [];

    for (const [equipo, fechasMap] of mapa.entries()) {
      fechasMap.forEach((hora, fecha) => {
        result.push({
          fecha,
          modelo_equipo: equipo,
          promedio_ultima_perf_dia_fr: hora,
        });
      });
    }

    return result.sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  //=========================================
  // 🔥 GRAFICO 16
  //=========================================

  procesarLaborFR() {
    const mapa = new Map<string, Map<string, any>>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const modelo = op.modelo_equipo || 'SIN_EQUIPO';
      const fecha = op.fecha || 'SIN_FECHA';

      const operativos = registrosArray.filter((r) => r.estado === 'OPERATIVO');

      let mejorRegistro: any = null;
      let mejorHora = Infinity;

      operativos.forEach((r) => {
        const hora = r?.hora_inicio;
        if (!hora) return;

        const [h, m] = hora.split(':').map(Number);
        const horaDecimal = h + m / 60;

        // 🔥 buscamos la MÁS TEMPRANA
        if (horaDecimal < mejorHora) {
          mejorHora = horaDecimal;
          mejorRegistro = r;
        }
      });

      if (!mejorRegistro) return;

      const operacion = mejorRegistro?.operacion || mejorRegistro;

      const tipoLabor = operacion?.tipo_labor || '';
      const labor = operacion?.labor || '';
      const ala = operacion?.ala || '';

      const labor_fr = `${tipoLabor}${labor}${ala}`;

      // =========================
      // MAPA por modelo + fecha
      // =========================
      const key = modelo;

      if (!mapa.has(key)) {
        mapa.set(key, new Map());
      }

      const mapaFechas = mapa.get(key)!;

      // solo 1 registro por día (primera labor)
      mapaFechas.set(fecha, {
        modelo_equipo: modelo,
        fecha,
        hora_inicio: mejorRegistro.hora_inicio,
        labor_fr,
      });
    });

    // =========================
    // OUTPUT FINAL
    // =========================
    const result: any[] = [];

    for (const [, fechasMap] of mapa.entries()) {
      fechasMap.forEach((value) => {
        result.push(value);
      });
    }

    return result.sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  // =========================================
  // Grafico 17
  // =========================================
  procesarPercusionConMetrosJumbos() {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const key = op.modelo_equipo || 'SIN_EQUIPO';
      const registrosArray = op.registros;

      // =========================
      // 🔥 METROS PERFORADOS
      // =========================
      const metros = Array.isArray(registrosArray)
        ? this.calcularMetrosPerforados(registrosArray)
        : 0;

      // =========================
      // 🔥 PERCUSIÓN
      // =========================
      const horo = (op as any)?.horometros;
      const percusion = horo?.percusion;

      const difPercusion =
        !isNaN(Number(percusion?.inicio)) && !isNaN(Number(percusion?.final))
          ? Number(percusion.final) - Number(percusion.inicio)
          : 0;

      // =========================
      // 🔥 MAPA INIT
      // =========================
      if (!mapa.has(key)) {
        mapa.set(key, {
          modelo_equipo: key,

          metros_perforados: 0,
          percusion: 0,

          // 🔥 acumuladores
          sum_long_barras: 0,
          count_long_barras: 0,

          tal_alivio: 0,
          tal_prod: 0,
          tal_repaso: 0,
          tal_rimados: 0,

          // 🔥 resultados finales
          long_barras: 0,
          fr_mhr_hp: 0,
        });
      }

      const item = mapa.get(key)!;

      item.metros_perforados += metros;
      item.percusion += difPercusion;

      // =========================
      // 🔥 RECORRER REGISTROS
      // =========================
      if (Array.isArray(registrosArray)) {
        registrosArray.forEach((r) => {
          const opData = r?.operacion || r;

          const lb = Number(opData?.long_barras);

          // ✅ SOLO valores válidos
          if (!isNaN(lb) && lb > 0) {
            item.sum_long_barras += lb;
            item.count_long_barras += 1;
          }

          item.tal_alivio += Number(opData?.tal_alivio) || 0;
          item.tal_prod += Number(opData?.tal_prod) || 0;
          item.tal_repaso += Number(opData?.tal_repaso) || 0;
          item.tal_rimados += Number(opData?.tal_rimados) || 0;
        });
      }
    });

    // =========================
    // 🔥 CÁLCULOS FINALES
    // =========================
    for (const item of mapa.values()) {
      // 🔥 PROMEDIO LONG_BARRAS
      item.long_barras =
        item.count_long_barras > 0
          ? item.sum_long_barras / item.count_long_barras
          : 0;

      // 🔥 KPI FR
      item.fr_mhr_hp =
        item.percusion > 0 ? item.metros_perforados / item.percusion : 0;

      // 🔥 limpiar basura técnica
      delete item.sum_long_barras;
      delete item.count_long_barras;
    }

    return Array.from(mapa.values());
  }

  // =========================================
  // GRAFICO 18
  // =========================================

  procesarFrPorOperadorTurno() {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const operador = op.operador || 'SIN_OPERADOR';
      const turno = op.turno || 'SIN_TURNO';

      const key = `${operador}-${turno}`;

      // =========================
      // 🔥 METROS PERFORADOS
      // =========================
      const metros = this.calcularMetrosPerforados(registrosArray);

      // =========================
      // 🔥 PERCUSIÓN
      // =========================
      const horo = (op as any)?.horometros;
      const percusion = horo?.percusion;

      const difPercusion =
        !isNaN(Number(percusion?.inicio)) && !isNaN(Number(percusion?.final))
          ? Number(percusion.final) - Number(percusion.inicio)
          : 0;

      // =========================
      // 🔥 MAPA
      // =========================
      if (!mapa.has(key)) {
        mapa.set(key, {
          operador,
          turno,
          metros_perforados: 0,
          dif_percusion: 0,
          fr_mhr_hp: 0,
        });
      }

      const item = mapa.get(key)!;

      item.metros_perforados += metros;
      item.dif_percusion += difPercusion;
    });

    // =========================
    // 🔥 FR FINAL (tipo DAX)
    // =========================
    for (const item of mapa.values()) {
      item.fr_mhr_hp =
        item.dif_percusion > 0
          ? item.metros_perforados / item.dif_percusion
          : 0;
    }

    return Array.from(mapa.values());
  }

  // =========================================
  // GRAFICO 19
  // =========================================

  procesarLaborFRDetallado() {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const modelo = op.modelo_equipo || 'SIN_EQUIPO';
      const operador = op.operador || 'SIN_OPERADOR';

      registrosArray.forEach((r) => {
        const operacion = r?.operacion || {};

        const tipo_labor = operacion?.tipo_labor || '';
        const labor = operacion?.labor || '';
        const ala = operacion?.ala || '';

        const observaciones = operacion?.observaciones;

        // ❌ filtrar observaciones vacías
        if (!observaciones || !observaciones.trim()) return;

        const labor_fr = `${tipo_labor}${labor}${ala}`.trim();

        const key = `${modelo}-${operador}-${labor_fr}`;

        if (!mapa.has(key)) {
          mapa.set(key, {
            modelo_equipo: modelo,
            operador,
            labor_fr,
            observaciones,
            count: 0,
          });
        }

        const item = mapa.get(key)!;

        item.count += 1;
      });
    });

    return Array.from(mapa.values());
  }

  // =========================================
  // grafico 20
  // =========================================
  procesarTipoPerforacion() {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      registrosArray.forEach((r) => {
        const operacion = r?.operacion || {};

        const tipoPerforacion = (operacion?.tipo_perforacion || '')
          .toString()
          .trim()
          .toUpperCase();

        // 🔥 CLAVE (puedes agrupar como quieras)
        const key = `${op.modelo_equipo}-${tipoPerforacion}`;

        if (!mapa.has(key)) {
          mapa.set(key, {
            modelo_equipo: op.modelo_equipo || 'SIN_EQUIPO',
            tipo_perforacion: tipoPerforacion,
            n_disparos: 0,
          });
        }

        const item = mapa.get(key)!;

        // 🔥 COUNTROWS equivalente
        item.n_disparos += 1;
      });
    });

    return Array.from(mapa.values());
  }

  //=========================================
  // GRAFICO 21
  //=========================================

  procesarDataPerforacionDetallada() {
    const mapa = new Map<string, any>();

    let totalRegistros = 0;
    let descartadosSinTipo = 0;
    let aceptados = 0;

    ////console.log('🚀 INICIO procesamiento perforación');

    this.operacionesFiltradas.forEach((op) => {
      const key = op.modelo_equipo || 'SIN_EQUIPO';
      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) {
        ////console.log(`⚠️ ${key} descartado: registros no es array`);
        return;
      }

      ////console.log(`\n📦 Equipo: ${key} | registros: ${registrosArray.length}`);

      registrosArray.forEach((r, idx) => {
        totalRegistros++;

        //console.log('➡️ Registro ENTRANTE:', r);

        const operacion = r?.operacion || {};

        const tipo_perforacion = operacion?.tipo_perforacion;

        // =========================
        // 🔥 FILTRO CRÍTICO
        // =========================
        if (!tipo_perforacion) {
          descartadosSinTipo++;
          ////console.log('❌ DESCARTADO (sin tipo_perforacion):', r);
          return;
        }

        aceptados++;

        const labor_fr =
          `${operacion?.tipo_labor ?? ''}${operacion?.labor ?? ''}${operacion?.ala ?? ''}`.trim();

        const metros = this.calcularMetrosPerforados([r]);

        const long_barras = Number(operacion?.long_barras) || 0;
        const tal_alivio = Number(operacion?.tal_alivio) || 0;
        const tal_prod = Number(operacion?.tal_prod) || 0;
        const tal_repaso = Number(operacion?.tal_repaso) || 0;
        const tal_rimados = Number(operacion?.tal_rimados) || 0;

        // 🔥 SOLUCIÓN: Usar ID único por registro
        // Opción 1: Usar el número de registro + timestamp + índice
        const mapKey = `${key}-${tipo_perforacion}-${labor_fr}-${r.numero}-${Date.now()}-${idx}`;

        // Opción 2: Usar un contador interno (más limpio)
        // const mapKey = `${key}-${tipo_perforacion}-${labor_fr}-${aceptados}`;

        // Opción 3: Si cada registro tiene un ID único
        // const mapKey = r.id || `${key}-${tipo_perforacion}-${labor_fr}-${Date.now()}-${Math.random()}`;

        if (!mapa.has(mapKey)) {
          mapa.set(mapKey, {
            modelo_equipo: key,
            tipo_perforacion,
            labor_fr,
            metros_perforados: 0,
            sum_long_barras: 0,
            count_long_barras: 0,
            tal_alivio: 0,
            tal_prod: 0,
            tal_repaso: 0,
            tal_rimados: 0,
            long_barras: 0,
            // Opcional: guardar datos originales para trazabilidad
            numero_registro: r.numero,
            hora_inicio: r.hora_inicio,
            hora_final: r.hora_final,
          });
        }

        const item = mapa.get(mapKey)!;

        item.metros_perforados += metros;

        if (long_barras > 0) {
          item.sum_long_barras += long_barras;
          item.count_long_barras++;
        }

        item.tal_alivio += tal_alivio;
        item.tal_prod += tal_prod;
        item.tal_repaso += tal_repaso;
        item.tal_rimados += tal_rimados;

        ////console.log('✅ ACEPTADO:', {
        //   key,
        //   tipo_perforacion,
        //   labor_fr,
        //   metros,
        //   mapKey  // Para depuración
        // });
      });
    });

    // =========================
    // 🔥 PROMEDIO FINAL
    // =========================
    for (const item of mapa.values()) {
      item.long_barras =
        item.count_long_barras > 0
          ? item.sum_long_barras / item.count_long_barras
          : 0;
    }

    const resultado = Array.from(mapa.values());

    // =========================
    // 🔥 RESUMEN FINAL
    // =========================
    ////console.log('\n========================');
    ////console.log('📊 RESUMEN FINAL');
    ////console.log('========================');
    ////console.log('Total registros:', totalRegistros);
    ////console.log('Aceptados:', aceptados);
    ////console.log('Descartados sin tipo_perforacion:', descartadosSinTipo);
    ////console.log('Registros individuales (sin agrupar):', resultado.length);
    ////console.log('✅ Coincidencia:', aceptados === resultado.length ? '✓ PERFECTO' : '✗ INCONSISTENCIA');
    ////console.log('Resultado:', resultado);

    return resultado;
  }
  // =========================================
  // GRAFICO 22
  // =========================================

  procesarHorasNumericas() {
    const result: any[] = [];

    this.operacionesFiltradas.forEach((op) => {
      const modelo = op.modelo_equipo || 'SIN_EQUIPO';
      const fecha = op.fecha || 'SIN_FECHA';

      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      registrosArray.forEach((r) => {
        // 🔥 FILTRO POR CODIGO
        const codigo = String(r?.codigo);
        if (codigo !== '101' && codigo !== '111') return;

        const horaStr = r?.hora_inicio;
        if (!horaStr) return;

        // =========================
        // 🔥 PARSE HORA
        // =========================
        const partes = horaStr.split(':').map(Number);

        const h = partes[0] || 0;
        const m = partes[1] || 0;
        const s = partes[2] || 0;

        // =========================
        // 🔥 HORA DECIMAL
        // =========================
        const hora_decimal = h + m / 60 + s / 3600;

        result.push({
          modelo_equipo: modelo,
          fecha,
          hora_inicio: horaStr,
          hora_decimal,
          codigo, // 🔥 opcional pero recomendado
        });
      });
    });

    return result.sort((a, b) => {
      if (a.fecha === b.fecha) {
        return a.hora_decimal - b.hora_decimal;
      }
      return a.fecha.localeCompare(b.fecha);
    });
  }

  //---------------------------------------------
  estadosBloqueados = ['FUERA DE PLAN'];

  mapaEstados: Map<string, any> = new Map();

  construirMapaEstados() {
    this.mapaEstados.clear();

    this.estadosProceso.forEach((e) => {
      const codigo = String(e.codigo || '').trim();
      this.mapaEstados.set(codigo, e);
    });

    //console.log('🧩 Mapa de estados construido:', this.mapaEstados.size);
  }

  prepararDatosGraficoEstados(): void {
    if (!this.mapaEstados.size) {
      console.warn(
        '⚠️ mapaEstados vacío, asegúrate de ejecutar construirMapaEstados() antes',
      );
    }

    this.datosGraficoEstados = this.operacionesFiltradas.flatMap(
      (operacion) => {
        const registros = Array.isArray(operacion.registros)
          ? operacion.registros
          : [];

        return registros
          .map((estado: any) => {
            const codigo = String(estado.codigo || '').trim();
            const estadoOperacion = (estado.estado || '').toUpperCase().trim();

            const estadoMatch = this.mapaEstados.get(codigo);

            // 🔥 Debug clave (solo cuando falla)
            if (!estadoMatch) {
              console.warn('❌ Sin match:', {
                codigo,
                estadoOperacion,
                registro: estado,
              });
            }

            return {
              codigoOperacion:
                operacion.modelo_equipo || operacion.n_equipo || operacion.id,
              turno: operacion.turno,

              // 🔹 base
              estado: estadoOperacion,
              codigoEstado: codigo,

              // 🔥 enriquecido desde catálogo
              tipo_estado: estadoMatch?.tipo_estado || null,
              categoria: estadoMatch?.categoria || null,
              estado_principal_match: estadoMatch?.estado_principal || null,

              hora_inicio: estado.hora_inicio,
              hora_final: estado.hora_final,
            };
          })
          .filter((e) => !this.estadosBloqueados.includes(e.estado));
      },
    );
  }
  private esperarRenderizado(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  }

  async generarPDF(): Promise<void> {
    this.cargandoPDF = true;

    try {
      await this.esperarRenderizado();

      configurarCabeceraPDF({
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
        turno: this.turnoAplicado || 'TODOS',
        tipoOperacion: 'PERFORACIÓN HORIZONTAL',
        fechaGeneracion: new Date(),
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      this.agregarPaginaResumenYGraficos(pdf);

      agregarPaginaConGraficos2x3(
        pdf,
        'REPORTE OPERATIVO - INDICADORES PRINCIPALES',
        [
          {
            component: this.disparosDiaChart,
            title: 'DISPAROS POR DÍA',
          },
          ...this.obtenerParetosPDF().slice(0, 3),
          {
            component: this.perforadoEquipoChart,
            title: 'PERFORADO POR EQUIPO',
          },
          {
            component: this.mhrEquipoChart,
            title: 'M/HR POR EQUIPO',
          },
        ],
      );
      // GRAFICOS HOROMETROS
      this.agregarPaginaPerforadoHorometrosConTabla(pdf);
      // =========================
      // PÁGINAS SIGUIENTES: TABLAS
      // =========================
      pdf.addPage();
      agregarCabeceraPDF(pdf, 'REPORTE OPERATIVO - TABLAS');
      let yTablas = 30;
      yTablas = this.agregarTablaDetallePerforacion(pdf, yTablas);
      yTablas = this.agregarTablaDetalleDisparos(pdf, yTablas);
      yTablas = this.agregarTablaMejoresOperadores(pdf, yTablas);
      yTablas = this.agregarTablaObservaciones(pdf, yTablas);

      pdf.save(`resumen-operativo-${this.obtenerFechaArchivo()}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      this.cargandoPDF = false;
    }
  }

  private valorPDF(valor: any): string {
    if (valor === null || valor === undefined || valor === '') {
      return '-';
    }

    return String(valor);
  }

  private numeroPDF(valor: any, decimales: number = 2): string {
    const numero = Number(valor || 0);

    return numero.toLocaleString('en-US', {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    });
  }

  private agregarPaginaPerforadoHorometrosConTabla(pdf: jsPDF): void {
    pdf.addPage();

    agregarCabeceraPDF(pdf, 'REPORTE OPERATIVO - PERFORADO Y HORÓMETROS');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const marginX = 8;
    const startY = 30;
    const bottomMargin = 8;

    const gapX = 6;
    const gapY = 7;

    const cardWidth = (pageWidth - marginX * 2 - gapX) / 2;

    const availableHeight = pageHeight - startY - bottomMargin;
    const maxCardHeight = (availableHeight - gapY * 2) / 3;

    // Mientras más alto el ratio, más bajo queda el cuadro.
    // 1.7 = más alto
    // 1.9 = equilibrado
    // 2.1 = más compacto
    const chartRatio = 1.9;

    const cardHeight = Math.min(maxCardHeight, cardWidth / chartRatio);

    const posiciones = [
      { x: marginX, y: startY },
      { x: marginX + cardWidth + gapX, y: startY },

      { x: marginX, y: startY + cardHeight + gapY },
      { x: marginX + cardWidth + gapX, y: startY + cardHeight + gapY },

      { x: marginX, y: startY + (cardHeight + gapY) * 2 },
      { x: marginX + cardWidth + gapX, y: startY + (cardHeight + gapY) * 2 },
    ];

    agregarTablaPrimeraPerforacionPDF(
      pdf,
      this.dataProcesoLaborFR || [],
      'HORAS PRIMERA PERFORACIÓN',
      posiciones[0].x,
      posiciones[0].y,
      cardWidth,
      cardHeight,
    );

    const horometrosJumboImage = obtenerImagenChart(this.horometrosJumbosChart);
    if (horometrosJumboImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        horometrosJumboImage,
        'HORÓMETROS JUMBOS',
        posiciones[1].x,
        posiciones[1].y,
        cardWidth,
        cardHeight,
      );
    }

    const horometrosEquipoImage = obtenerImagenChart(this.totalHorometrosChart);
    if (horometrosEquipoImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        horometrosEquipoImage,
        'TOTAL HORÓMETROS',
        posiciones[2].x,
        posiciones[2].y,
        cardWidth,
        cardHeight,
      );
    }
    const avanceFaseImage = obtenerImagenChart(this.avanceFaseChart);
    if (avanceFaseImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        avanceFaseImage,
        'METROS PERFORADOS POR FASE',
        posiciones[3].x,
        posiciones[3].y,
        cardWidth,
        cardHeight,
      );
    }
    const disparosTipoPerforacionImage = obtenerImagenChart(
      this.disparosTipoPerforacionChart,
    );
    if (disparosTipoPerforacionImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        disparosTipoPerforacionImage,
        'DISPAROS POR TIPO DE PERFORACIÓN',
        posiciones[4].x,
        posiciones[4].y,
        cardWidth,
        cardHeight,
      );
    }
    const promedioEstadosImage = obtenerImagenChart(this.promedioEstadosChart);
    if (promedioEstadosImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        promedioEstadosImage,
        'HORAS PROMEDIO POR ESTADO',
        posiciones[5].x,
        posiciones[5].y,
        cardWidth,
        cardHeight,
      );
    }
  }
  private agregarTablaDetallePerforacion(pdf: jsPDF, startY: number): number {
    const data = this.dataPercusionConMetrosJumbos || [];

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Sin datos para DETALLE PERFORACIÓN');
      return startY;
    }

    const dataOrdenada = [...data].sort((a, b) =>
      String(a.modelo_equipo || '').localeCompare(
        String(b.modelo_equipo || ''),
      ),
    );

    const columnas = [
      'Equipo',
      'Metros perforados',
      'Percusión',
      'Long. barras',
      'FR M/HR',
      'Tal. alivio',
      'Tal. prod.',
      'Tal. repaso',
      'Tal. rimados',
    ];

    const filas = dataOrdenada.map((item: any) => [
      this.valorPDF(item.modelo_equipo),
      this.numeroPDF(item.metros_perforados, 2),
      this.numeroPDF(item.percusion, 2),
      this.numeroPDF(item.long_barras, 2),
      this.numeroPDF(item.fr_mhr_hp, 2),
      this.numeroPDF(item.tal_alivio, 0),
      this.numeroPDF(item.tal_prod, 0),
      this.numeroPDF(item.tal_repaso, 0),
      this.numeroPDF(item.tal_rimados, 0),
    ]);

    const totalMetros = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.metros_perforados || 0),
      0,
    );

    const totalPercusion = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.percusion || 0),
      0,
    );

    const totalTalAlivio = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.tal_alivio || 0),
      0,
    );

    const totalTalProd = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.tal_prod || 0),
      0,
    );

    const totalTalRepaso = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.tal_repaso || 0),
      0,
    );

    const totalTalRimados = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.tal_rimados || 0),
      0,
    );

    const frMhrTotal = totalPercusion > 0 ? totalMetros / totalPercusion : 0;

    filas.push([
      'TOTAL',
      this.numeroPDF(totalMetros, 2),
      this.numeroPDF(totalPercusion, 2),
      '-',
      this.numeroPDF(frMhrTotal, 2),
      this.numeroPDF(totalTalAlivio, 0),
      this.numeroPDF(totalTalProd, 0),
      this.numeroPDF(totalTalRepaso, 0),
      this.numeroPDF(totalTalRimados, 0),
    ]);

    return agregarTablaContinuaPDF(pdf, {
      tituloReporte: 'REPORTE OPERATIVO - TABLAS',
      tituloTabla: 'DETALLE PERFORACIÓN',
      columnas,
      filas,
      startY,
      marginLeft: 8,
      marginRight: 8,
    });
  }
  private agregarTablaDetalleDisparos(pdf: jsPDF, startY: number): number {
    const data = this.datadetalleDisparos || [];

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Sin datos para DETALLE DISPAROS');
      return startY;
    }

    const dataOrdenada = [...data].sort((a, b) => {
      const equipoA = String(a.modelo_equipo || '');
      const equipoB = String(b.modelo_equipo || '');

      const diffEquipo = equipoA.localeCompare(equipoB);
      if (diffEquipo !== 0) return diffEquipo;

      const horaA = String(a.hora_inicio || '');
      const horaB = String(b.hora_inicio || '');

      return horaA.localeCompare(horaB);
    });

    const columnas = [
      'Equipo',
      'Tipo perforación',
      'Labor',
      'N° Reg.',
      'Hora inicio',
      'Hora final',
      'Metros',
      'Long. barras',
      'Tal. alivio',
      'Tal. prod.',
      'Tal. repaso',
      'Tal. rimados',
    ];

    const filas = dataOrdenada.map((item: any) => [
      this.valorPDF(item.modelo_equipo),
      this.valorPDF(item.tipo_perforacion),
      this.valorPDF(item.labor_fr),
      this.valorPDF(item.numero_registro),
      this.valorPDF(item.hora_inicio),
      this.valorPDF(item.hora_final),
      this.numeroPDF(item.metros_perforados, 2),
      this.numeroPDF(item.long_barras, 2),
      this.numeroPDF(item.tal_alivio, 0),
      this.numeroPDF(item.tal_prod, 0),
      this.numeroPDF(item.tal_repaso, 0),
      this.numeroPDF(item.tal_rimados, 0),
    ]);

    const totalMetros = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.metros_perforados || 0),
      0,
    );

    const totalTalAlivio = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.tal_alivio || 0),
      0,
    );

    const totalTalProd = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.tal_prod || 0),
      0,
    );

    const totalTalRepaso = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.tal_repaso || 0),
      0,
    );

    const totalTalRimados = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.tal_rimados || 0),
      0,
    );

    filas.push([
      'TOTAL',
      '-',
      '-',
      '-',
      '-',
      '-',
      this.numeroPDF(totalMetros, 2),
      '-',
      this.numeroPDF(totalTalAlivio, 0),
      this.numeroPDF(totalTalProd, 0),
      this.numeroPDF(totalTalRepaso, 0),
      this.numeroPDF(totalTalRimados, 0),
    ]);

    return agregarTablaContinuaPDF(pdf, {
      tituloReporte: 'REPORTE OPERATIVO - TABLAS',
      tituloTabla: 'DETALLE DISPAROS',
      columnas,
      filas,
      startY,
      marginLeft: 8,
      marginRight: 8,
    });
  }
  private agregarTablaMejoresOperadores(pdf: jsPDF, startY: number): number {
    const data = this.dataFrPorOperadorTurno || [];

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Sin datos para MEJORES OPERADORES');
      return startY;
    }

    const dataOrdenada = [...data].sort(
      (a, b) => Number(b.fr_mhr_hp || 0) - Number(a.fr_mhr_hp || 0),
    );

    const columnas = [
      'Ranking',
      'Operador',
      'Turno',
      'Metros perforados',
      'Percusión',
      'FR M/HR',
    ];

    const filas = dataOrdenada.map((item: any, index: number) => [
      String(index + 1),
      this.valorPDF(item.operador),
      this.valorPDF(item.turno),
      this.numeroPDF(item.metros_perforados, 2),
      this.numeroPDF(item.dif_percusion, 2),
      this.numeroPDF(item.fr_mhr_hp, 2),
    ]);

    const totalMetros = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.metros_perforados || 0),
      0,
    );

    const totalPercusion = dataOrdenada.reduce(
      (sum, item) => sum + Number(item.dif_percusion || 0),
      0,
    );

    const frMhrTotal = totalPercusion > 0 ? totalMetros / totalPercusion : 0;

    filas.push([
      'TOTAL',
      '-',
      '-',
      this.numeroPDF(totalMetros, 2),
      this.numeroPDF(totalPercusion, 2),
      this.numeroPDF(frMhrTotal, 2),
    ]);

    return agregarTablaContinuaPDF(pdf, {
      tituloReporte: 'REPORTE OPERATIVO - TABLAS',
      tituloTabla: 'MEJORES OPERADORES',
      columnas,
      filas,
      startY,
      marginLeft: 8,
      marginRight: 8,
    });
  }
  private agregarTablaObservaciones(pdf: jsPDF, startY: number): number {
    const data = this.dataLaborFRDetallado || [];

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Sin datos para OBSERVACIONES');
      return startY;
    }

    const dataOrdenada = [...data].sort((a, b) => {
      const equipoA = String(a.modelo_equipo || '');
      const equipoB = String(b.modelo_equipo || '');

      const diffEquipo = equipoA.localeCompare(equipoB);
      if (diffEquipo !== 0) return diffEquipo;

      const operadorA = String(a.operador || '');
      const operadorB = String(b.operador || '');

      const diffOperador = operadorA.localeCompare(operadorB);
      if (diffOperador !== 0) return diffOperador;

      const laborA = String(a.labor_fr || '');
      const laborB = String(b.labor_fr || '');

      return laborA.localeCompare(laborB);
    });

    const columnas = ['Equipo', 'Operador', 'Labor', 'Observaciones', 'Cant.'];

    const filas = dataOrdenada.map((item: any) => [
      this.valorPDF(item.modelo_equipo),
      this.valorPDF(item.operador),
      this.valorPDF(item.labor_fr),
      this.valorPDF(item.observaciones),
      this.numeroPDF(item.count, 0),
    ]);

    return agregarTablaContinuaPDF(pdf, {
      tituloReporte: 'REPORTE OPERATIVO - TABLAS',
      tituloTabla: 'OBSERVACIONES',
      columnas,
      filas,
      startY,
      marginLeft: 8,
      marginRight: 8,
      columnStyles: {
        0: {
          cellWidth: 24,
          halign: 'center',
        },
        1: {
          cellWidth: 38,
        },
        2: {
          cellWidth: 28,
        },
        3: {
          cellWidth: 92,
        },
        4: {
          cellWidth: 12,
          halign: 'center',
        },
      },
    });
  }

  private obtenerParetosPDF(): PdfChartConfig[] {
    const paretos = this.paretoCharts?.toArray() || [];

    return paretos.map((chart) => ({
      component: chart,
      title: chart.getChartTitle ? chart.getChartTitle() : 'GRÁFICO PARETO',
    }));
  }

  private agregarResumenPDF(
    pdf: jsPDF,
    resumen: any,
    posicion: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
  ): void {
    const { x, y, width, height } = posicion;

    // Contenedor principal
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(220, 220, 220);
    pdf.roundedRect(x, y, width, height, 3, 3, 'FD');

    // Título
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(11, 31, 58);
    pdf.text('RESUMEN OPERATIVO', x + 4, y + 6);

    const items = [
      {
        label: 'EQUIPOS',
        value: this.formatearNumero(resumen?.conteoEquipos, 0),
        unit: 'equipos',
      },
      {
        label: 'M/DISP.',
        value: this.formatearNumero(resumen?.metrosPorDisparo, 2),
        unit: 'm/disparo',
      },
      {
        label: 'DISPAROS',
        value: this.formatearNumero(resumen?.nFrentes, 0),
        unit: 'disparos',
      },
      {
        label: 'TOTAL PERF.',
        value: this.formatearNumero(resumen?.totalMetros, 0),
        unit: 'm',
      },
    ];

    const padding = 4;
    const titleHeight = 9;
    const gap = 3;

    const innerX = x + padding;
    const innerY = y + titleHeight;
    const innerWidth = width - padding * 2;
    const innerHeight = height - titleHeight - padding;

    const miniCardWidth = (innerWidth - gap) / 2;
    const miniCardHeight = (innerHeight - gap) / 2;

    const posiciones = [
      { x: innerX, y: innerY },
      { x: innerX + miniCardWidth + gap, y: innerY },
      { x: innerX, y: innerY + miniCardHeight + gap },
      { x: innerX + miniCardWidth + gap, y: innerY + miniCardHeight + gap },
    ];

    items.forEach((item, index) => {
      const pos = posiciones[index];

      this.dibujarCardResumenCompacta(
        pdf,
        pos.x,
        pos.y,
        miniCardWidth,
        miniCardHeight,
        item.label,
        item.value,
        item.unit,
      );
    });
  }

  private agregarPaginaResumenYGraficos(pdf: jsPDF): void {
    agregarCabeceraPDF(pdf, 'REPORTE OPERATIVO - RESUMEN');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const marginX = 8;
    const startY = 30;
    const bottomMargin = 8;

    const gapX = 6;
    const gapY = 8;

    const cardWidth = (pageWidth - marginX * 2 - gapX) / 2;

    const availableHeight = pageHeight - startY - bottomMargin;
    const maxCardHeight = (availableHeight - gapY * 2) / 3;

    // Mientras más alto el ratio, más bajita queda la card
    const chartRatio = 1.8;

    const cardHeight = Math.min(maxCardHeight, cardWidth / chartRatio);

    const posiciones = [
      { x: marginX, y: startY },
      { x: marginX + cardWidth + gapX, y: startY },

      { x: marginX, y: startY + cardHeight + gapY },
      { x: marginX + cardWidth + gapX, y: startY + cardHeight + gapY },

      { x: marginX, y: startY + (cardHeight + gapY) * 2 },
      { x: marginX + cardWidth + gapX, y: startY + (cardHeight + gapY) * 2 },
    ];

    // =========================
    // CELDA 1: RESUMEN COMPACTO
    // =========================
    this.agregarResumenPDF(pdf, this.resumen, {
      x: posiciones[0].x,
      y: posiciones[0].y,
      width: cardWidth,
      height: cardHeight,
    });

    // =========================
    // CELDA 2: DISPAROS POR EQUIPO
    // =========================
    const disparosEquipoImage = obtenerImagenChart(this.disparosEquipoChart);

    if (disparosEquipoImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        disparosEquipoImage,
        'DISPAROS POR EQUIPO',
        posiciones[1].x,
        posiciones[1].y,
        cardWidth,
        cardHeight,
      );
    }

    // =========================
    // CELDA 3: RENDIMIENTO POR EQUIPO
    // =========================
    const rendimientoImage = obtenerImagenChart(this.rendimientoEquipoChart);

    if (rendimientoImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        rendimientoImage,
        'RENDIMIENTO POR EQUIPO',
        posiciones[2].x,
        posiciones[2].y,
        cardWidth,
        cardHeight,
      );
    }

    // =========================
    // CELDA 4: METROS PERFORADOS / DISPARO
    // =========================
    const metrosDisparoImage = obtenerImagenChart(this.metrosDisparoChart);

    if (metrosDisparoImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        metrosDisparoImage,
        'METROS PERFORADOS/DISPARO',
        posiciones[3].x,
        posiciones[3].y,
        cardWidth,
        cardHeight,
      );
    }
    // =========================
    // CELDA 5: RANKING OPERADOR
    // =========================
    const rankingImage = obtenerImagenChart(this.rankingOperadorChart);

    if (rankingImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        rankingImage,
        'RANKING OPERADOR',
        posiciones[4].x,
        posiciones[4].y,
        cardWidth,
        cardHeight,
      );
    }

    // =========================
    // CELDA 6: MAPA DE CALOR
    // =========================
    const mapaCalorImage = obtenerImagenChart(this.mapaDeCalorChart);

    if (mapaCalorImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        mapaCalorImage,
        'MAPA DE CALOR - INICIACIÓN',
        posiciones[5].x,
        posiciones[5].y,
        cardWidth,
        cardHeight,
      );
    }
  }

  private dibujarCardResumenCompacta(
    pdf: jsPDF,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    value: string,
    unit: string,
  ): void {
    pdf.setFillColor(247, 249, 248);
    pdf.setDrawColor(230, 230, 230);
    pdf.roundedRect(x, y, width, height, 2, 2, 'FD');

    const paddingX = 3;

    const labelY = y + height * 0.28;
    const valueY = y + height * 0.58;
    const unitY = y + height * 0.84;

    // Label
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(5.6);
    pdf.setTextColor(100, 100, 100);
    pdf.text(label, x + paddingX, labelY);

    // Valor
    pdf.setFont('helvetica', 'bold');

    const valueFontSize = String(value).length > 8 ? 8.5 : 10;
    pdf.setFontSize(valueFontSize);

    pdf.setTextColor(11, 31, 58);

    const valueLines = pdf.splitTextToSize(value, width - paddingX * 2);
    pdf.text(valueLines.slice(0, 1), x + paddingX, valueY);

    // Unidad
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(5.2);
    pdf.setTextColor(120, 120, 120);
    pdf.text(unit, x + paddingX, unitY);
  }

  private formatearNumero(valor: any, decimales: number = 0): string {
    const numero = Number(valor || 0);

    return numero.toLocaleString('en-US', {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    });
  }

  private obtenerFechaArchivo(): string {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minuto = String(fecha.getMinutes()).padStart(2, '0');

    return `${anio}-${mes}-${dia}_${hora}-${minuto}`;
  }

  //GANTT
  private construirGanttDataNuevo(): void {
    const fechaMap: Record<string, any> = {};

    this.operacionesFiltradas.forEach((op) => {
      const fecha = op.fecha || 'SIN_FECHA';
      const turno = op.turno || 'SIN_TURNO';
      const equipoCodigo = `${op.equipo} - ${op.n_equipo}`;

      // 🔥 clave combinada
      const key = `${fecha}|${turno}`;

      if (!fechaMap[key]) {
        fechaMap[key] = {
          fecha,
          turno,
          equipos: {},
        };
      }

      if (!fechaMap[key].equipos[equipoCodigo]) {
        fechaMap[key].equipos[equipoCodigo] = {};
      }

      const registros = Array.isArray(op.registros) ? op.registros : [];

      registros.forEach((reg: any) => {
        const estado = (reg.estado || 'SIN ESTADO').toUpperCase().trim();
        const codigo = String(reg.codigo || '').trim();

        if (!reg.hora_inicio || !reg.hora_final) return;

        // 🔥 MATCH CONTRA MAPA (igual que tu otro proceso)
        const estadoMatch = this.mapaEstados.get(codigo);

        // 🔥 puedes mantener estado o usar categoría (te dejo listo)
        const labor = estadoMatch?.estado_principal || estado;

        if (!fechaMap[key].equipos[equipoCodigo][labor]) {
          fechaMap[key].equipos[equipoCodigo][labor] = [];
        }

        fechaMap[key].equipos[equipoCodigo][labor].push({
          start: reg.hora_inicio,
          end: reg.hora_final,

          estado,
          description: codigo,

          // 🔥 CAMPOS ENRIQUECIDOS
          tipo_estado: estadoMatch?.tipo_estado || null,
          categoria: estadoMatch?.categoria || null,
          estado_principal: estadoMatch?.estado_principal || null,
        });

        // 🔍 debug opcional
        // if (!estadoMatch) {
        //   console.warn('❌ SIN MATCH GANTT:', codigo, reg);
        // }
      });
    });

    // 🔁 NORMALIZACIÓN FINAL
    this.ganttData = Object.values(fechaMap).map((item: any) => ({
      fecha: item.fecha,
      turno: item.turno,

      groups: Object.entries(item.equipos).map(
        ([equipoCodigo, labores]: any) => ({
          equipoCodigo,
          rows: Object.entries(labores).map(([labor, tasks]: any) => ({
            labor,
            tasks: tasks.sort((a: any, b: any) =>
              a.start.localeCompare(b.start),
            ),
          })),
        }),
      ),
    }));
  }
}
