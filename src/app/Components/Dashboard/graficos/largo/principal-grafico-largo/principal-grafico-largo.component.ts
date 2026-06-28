import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FechasPlanMensualService } from '../../../../../services/fechas-plan-mensual.service';
import { OperacionesService } from '../../../../../services/operaciones.service';
import {
  OperacionBase,
  OperacionBaseTLargos,
  Registro,
} from '../../../../../models/OperacionBase.models';
import { PlanMensual } from '../../../../../models/plan-mensual.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumenComponent } from '../../../../../features/dashboard/components/resumen/resumen.component';
import { DisparosEquipoChartComponent } from '../../../../../features/dashboard/components/disparos-equipo-chart/disparos-equipo-chart.component';
import {
  PerforadoEquipoChartComponent,
  PerforadoEquipoChartItem,
} from '../../../../../features/dashboard/components/perforado-equipo-chart/perforado-equipo-chart.component';
import {
  MhrEquipoComponent,
  MhrEquipoItem,
} from '../../../../../features/dashboard/components/mhr-equipo/mhr-equipo.component';
import {
  HorometrosEquipoComponent,
  HorometroEquipoItem,
} from '../../../../../features/dashboard/components/horometros-equipo/horometros-equipo.component';
import {
  TotalHorometrosComponent,
  TotalHorometroItem,
} from '../../../../../features/dashboard/components/total-horometros/total-horometros.component';
import {
  HorasPrimeraPerforacionComponent,
  HoraPrimeraPerforacionItem,
} from '../../../../../features/dashboard/components/horas-primera-perforacion/horas-primera-perforacion.component';
import {
  DisparosDiaChartComponent,
  DisparosDiaItem,
} from '../../../../../features/dashboard/components/disparos-dia-chart/disparos-dia-chart.component';
import {
  DetallePerforacionComponent,
  DetallePerforacionItem,
} from '../../../../../features/dashboard/components/detalle-perforacion/detalle-perforacion.component';
import {
  DetalleDisparosComponent,
  DetalleDisparoItem,
} from '../../../../../features/dashboard/components/detalle-disparos/detalle-disparos.component';
import {
  MejoresOperadoresComponent,
  MejoresOperadorItem,
} from '../../../../../features/dashboard/components/mejores-operadores/mejores-operadores.component';
import {
  RankingOperadorComponent,
  RankingOperadorItem,
} from '../../../../../features/dashboard/components/ranking-operador/ranking-operador.component';
import {
  ObservacionesComponent,
  ObservacionItem,
} from '../../../../../features/dashboard/components/observaciones/observaciones.component';
import {
  RendimientoEquipoChartComponent,
  RendimientoEquipoChartItem,
} from '../../../../../features/dashboard/components/rendimiento-equipo-chart/rendimiento-equipo-chart.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SchedulerComponent } from '../../Linea de tiempo/scheduler/scheduler.component';
import { EstadoService } from '../../../../../services/estado.service';
import { ApiService } from '../../../../../services/api.service';
import { OperacionTLargos } from '../../../../../models/OperacionTLargos';
import { TipoPerforacion } from '../../../../../models/tipo-perforacion.model';
import { DashboardFiltrosComponent } from '../../../../../features/dashboard/components/dashboard-filtros/dashboard-filtros.component';
import {
  MapaDeCalorComponent,
  MapaDeCalorItem,
} from '../../../../../features/dashboard/components/mapa-de-calor/mapa-de-calor.component';
import {
  DisparosEquipoChartItem,
  DisparosEquipoSegmento,
} from '../../../../../features/dashboard/components/disparos-equipo-chart/disparos-equipo-chart.component';
import {
  ParetoChartItem,
  GraficaParetoChartComponent,
} from '../../../../../features/dashboard/components/grafica-pareto-chart/grafica-pareto-chart.component';
import {
  FiltrosDashboard,
  OpcionFiltroDashboard,
} from '../../../../../features/dashboard/models/dashboard-filtros.model';
import { MatDialog } from '@angular/material/dialog';
import { PresentacionTlargosDialogComponent } from '../../../../../features/dashboard/components/presentacion/presentacion-tlargos-dialog/presentacion-tlargos-dialog.component';
import {
  agregarCabeceraPDF,
  agregarGraficoEchartsPDFProporcional,
  agregarTablaContinuaPDF,
  configurarCabeceraPDF,
  obtenerImagenChart,
  PdfChartConfig,
} from '../../../../../config/config-pdf';
import {
  MetrosPerforadosDisparoComponent,
  MetrosPerforadosDisparoItem,
} from '../../../../../features/dashboard/components/metros-perforados-disparo/metros-perforados-disparo.component';
import { AvanceFaseComponent } from '../../horizontal/Graficos components/Hoja 1/avance-fase/avance-fase.component';
import {
  PromedioEstadoItem,
  PromedioEstadosEchartsComponent,
} from '../../../../../features/dashboard/components/promedio-estados-echarts/promedio-estados-echarts.component';
import {
  DisparosTipoPerforacionChartComponent,
  DisparosTipoPerforacionItem,
} from '../../../../../features/dashboard/components/disparos-tipo-perforacion-chart/disparos-tipo-perforacion-chart.component';
import { formatearFechaYYYYMMDD } from '../../../../../utils/fecha-utils';
import {
  getOperacionEquipoCodigo,
  getOperacionEquipoModelo,
  getSeccionNombre,
} from '../../../../../utils/operacion-display.utils';

type OperacionTalLargoConTipo = OperacionTLargos & {
  tipo_perforacion?: string;
};

@Component({
  selector: 'app-principal-grafico-largo',
  imports: [
    CommonModule,
    FormsModule,
    ResumenComponent,
    DisparosEquipoChartComponent,
    PerforadoEquipoChartComponent,
    MhrEquipoComponent,
    HorometrosEquipoComponent,
    TotalHorometrosComponent,
    HorasPrimeraPerforacionComponent,
    //AvanceFaseComponent,
    // DetallePerforacionComponent,
    //DetalleDisparosComponent,
    MejoresOperadoresComponent,
    RankingOperadorComponent,
    ObservacionesComponent,
    RendimientoEquipoChartComponent,
    GraficaParetoChartComponent,
    MapaDeCalorComponent,
    SchedulerComponent,
    DashboardFiltrosComponent,
    DisparosDiaChartComponent,
    DetallePerforacionComponent,
    DetalleDisparosComponent,
    DisparosTipoPerforacionChartComponent,
    PromedioEstadosEchartsComponent,
    MetrosPerforadosDisparoComponent,
  ],
  templateUrl: './principal-grafico-largo.component.html',
  styleUrl: './principal-grafico-largo.component.css',
})
export class PrincipalGraficoLargoComponent implements OnInit {
  @ViewChild(DisparosEquipoChartComponent)
  disparosEquipoChart!: DisparosEquipoChartComponent;
  @ViewChild(RendimientoEquipoChartComponent)
  rendimientoEquipoChart!: RendimientoEquipoChartComponent;
  @ViewChild(DisparosDiaChartComponent)
  disparosDiaChart!: DisparosDiaChartComponent;
  @ViewChildren(GraficaParetoChartComponent)
  paretoCharts!: QueryList<GraficaParetoChartComponent>;
  @ViewChild(MetrosPerforadosDisparoComponent)
  metrosDisparoChart!: MetrosPerforadosDisparoComponent;
  @ViewChild(RankingOperadorComponent)
  rankingOperadorChart!: RankingOperadorComponent;
  @ViewChild(MapaDeCalorComponent)
  mapaDeCalorChart!: MapaDeCalorComponent;

  @ViewChild(PerforadoEquipoChartComponent)
  perforadoEquipoChart!: PerforadoEquipoChartComponent;
  @ViewChild(MhrEquipoComponent) mhrEquipoChart!: MhrEquipoComponent;
  @ViewChild(HorometrosEquipoComponent)
  horometrosJumbosChart!: HorometrosEquipoComponent;
  @ViewChild(TotalHorometrosComponent)
  totalHorometrosChart!: TotalHorometrosComponent;
  @ViewChild(AvanceFaseComponent) avanceFaseChart!: AvanceFaseComponent;
  @ViewChild(DisparosTipoPerforacionChartComponent)
  disparosTipoPerforacionChart!: DisparosTipoPerforacionChartComponent;
  @ViewChild(PromedioEstadosEchartsComponent)
  promedioEstadosChart!: PromedioEstadosEchartsComponent;

  private readonly tiposDisparoTalLargo = new Set(['PRODUCCION', 'SLOT']);

  ESTADOS_OPERATIVOS = ['101', '102', '111', '112', '120'];
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
  tipoPerforacionMap = new Map<number, string>();

  anio!: number;
  mes!: string;

  // DATA ORIGINAL (sin filtrar)
  operacionesOriginal: OperacionBaseTLargos[] = [];
  operacionesFiltradas: OperacionBaseTLargos[] = [];

  // 🔥 DATA FINAL PARA LOS GRAFICOS
  //dataAvanceFase: any[] = [];
  dataDisparosEquipo: DisparosEquipoChartItem[] = [];
  dataDisparosDia: DisparosDiaItem[] = [];
  dataIndicadoresEquipo: any[] = [];
  dataDemorasOperativas: any[] = [];
  dataHorasNoOperativas: any[] = [];
  dataHorasMantenimiento: any[] = [];
  dataPerforadoEquipo: any[] = [];
  dataRendimientoEquipo: any[] = [];
  dataMhrEquipo: MhrEquipoItem[] = [];
  dataHorometrosJumbos: HorometroEquipoItem[] = [];
  dataPromedioPrimeraPerfDiaFR: any[] = [];
  dataPromedioPrimeraPerfDiaFRPorFecha: any[] = [];
  dataPromedioUltimaPerfDiaFR: any[] = [];
  dataPromedioUltimaPerfDiaFRPorFecha: any[] = [];
  dataProcesoLaborFR: HoraPrimeraPerforacionItem[] = [];
  dataPercusionConMetrosJumbos: DetallePerforacionItem[] = [];
  dataFrPorOperadorTurno: RankingOperadorItem[] = [];
  dataObservaciones: ObservacionItem[] = [];
  dataTipoPerforacion: DisparosTipoPerforacionItem[] = [];
  datadetalleDisparos: DetalleDisparoItem[] = [];
  dataHorasNumericas: MapaDeCalorItem[] = [];
  datosGraficoEstados: PromedioEstadoItem[] = [];
  dataParetoHorasOperativas: ParetoChartItem[] = [];
  dataParetoHorasNoOperativas: ParetoChartItem[] = [];
  dataParetoHorasMantenimiento: ParetoChartItem[] = [];
  dataMetrosPerforadosDisparo: MetrosPerforadosDisparoItem[] = [];

  // Variables para el filtro de fechas
  turnoSeleccionado: string = '';
  turnoAplicado: string = '';
  resumen: { label: string; value: number }[] = [];
  tiposFiltro: OpcionFiltroDashboard[] = [
    { label: 'Rango', value: 'rango' },
    { label: 'Año', value: 'anio' },
    { label: 'Mes', value: 'mes' },
    { label: 'Semana', value: 'semana' },
    { label: 'Día', value: 'dia' },
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

  estadosProceso: any[] = [];
  cargandoPDF = false;
  ganttData: any[] = [];
  vistaPrincipal: boolean = true;

  constructor(
    private operacionesService: OperacionesService,
    private estadoService: EstadoService,
    private apiService: ApiService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // 🔥 SETEO AUTOMÁTICO
    const hoy = this.getFechaHoy();
    this.fechaInicio = hoy;
    this.fechaFin = hoy;
    this.turnoSeleccionado = this.getTurnoActual();

    this.cargarOperaciones();
    this.obtenerEstadosPorProceso('PERFORACIÓN TALADROS LARGOS');
    this.cargarTiposPerforacion();
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

  aplicarFiltro(filtros: FiltrosDashboard): void {
    this.tipoFiltro = filtros.tipoFiltro;
    this.anioSeleccionado = filtros.anioSeleccionado;
    this.mesSeleccionado = filtros.mesSeleccionado;
    this.semanaSeleccionada = filtros.semanaSeleccionada;
    this.diaSeleccionado = filtros.diaSeleccionado;
    this.rangoFechas = filtros.rangoFechas;
    this.turnoSeleccionado = filtros.turnoSeleccionado ?? '';

    if (!this.calcularRangoFechas()) {
      return;
    }

    this.turnoAplicado = this.turnoSeleccionado;

    this.operacionesFiltradas = this.operacionesOriginal.filter((op) => {
      if (this.fechaInicio && op.fecha < this.fechaInicio) return false;
      if (this.fechaFin && op.fecha > this.fechaFin) return false;

      if (this.turnoAplicado && op.turno !== this.turnoAplicado) return false;

      return true;
    });
    console.log(this.operacionesFiltradas);
    this.procesarTodo();
  }

  Presentacion() {
    if (!this.operacionesFiltradas || this.operacionesFiltradas.length === 0) {
      console.warn('No hay datos filtrados para mostrar');
      return;
    }

    const dialogRef = this.dialog.open(PresentacionTlargosDialogComponent, {
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

  toggleVista() {
    this.vistaPrincipal = !this.vistaPrincipal;
  }

  construirMapaEstados() {
    this.mapaEstados.clear();

    this.estadosProceso.forEach((e) => {
      const codigo = String(e.codigo || '').trim();
      this.mapaEstados.set(codigo, e);
    });

    //console.log('🧩 Mapa de estados construido:', this.mapaEstados.size);
  }

  mapaEstados: Map<string, any> = new Map();

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

  private calcularRangoFechas(): boolean {
    if (this.tipoFiltro === 'anio') {
      if (!this.anioSeleccionado) return false;
      const anio = this.anioSeleccionado.getFullYear();
      this.fechaInicio = `${anio}-01-01`;
      this.fechaFin = `${anio}-12-31`;
      return true;
    }

    if (this.tipoFiltro === 'dia') {
      if (!this.diaSeleccionado) return false;
      this.fechaInicio = formatearFechaYYYYMMDD(this.diaSeleccionado);
      this.fechaFin = formatearFechaYYYYMMDD(this.diaSeleccionado);
      return true;
    }

    if (this.tipoFiltro === 'mes') {
      if (!this.mesSeleccionado) return false;
      const anio = this.mesSeleccionado.getFullYear();
      const mes = this.mesSeleccionado.getMonth();
      this.fechaInicio = formatearFechaYYYYMMDD(new Date(anio, mes, 1));
      this.fechaFin = formatearFechaYYYYMMDD(new Date(anio, mes + 1, 0));
      return true;
    }

    if (this.tipoFiltro === 'semana') {
      if (!this.semanaSeleccionada) return false;
      const inicio = new Date(this.semanaSeleccionada);
      const dia = inicio.getDay() || 7;
      inicio.setDate(inicio.getDate() - dia + 1);
      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);
      this.fechaInicio = formatearFechaYYYYMMDD(inicio);
      this.fechaFin = formatearFechaYYYYMMDD(fin);
      return true;
    }

    if (this.tipoFiltro === 'rango') {
      if (!this.rangoFechas || this.rangoFechas.length < 2) return false;
      const [inicio, fin] = this.rangoFechas;
      if (!inicio || !fin) return false;
      this.fechaInicio = formatearFechaYYYYMMDD(inicio);
      this.fechaFin = formatearFechaYYYYMMDD(fin);
      return true;
    }

    return false;
  }

  // =========================================
  // 🔥 OPERACIONES
  // =========================================
  cargarOperaciones() {
    const tipo = 'tal_largo';

    this.operacionesService.getAllAprobados<OperacionTLargos>(tipo).subscribe({
      next: (resp) => {
        this.operacionesOriginal = resp.data;

        console.log('🔥 DATA OPERACIONES:', this.operacionesOriginal);

        // 🔥 SOLO ESTO
        //this.aplicarFiltro();
      },
      error: (err) => {
        //console.error('❌ Error al obtener operaciones:', err);
      },
    });
  }

  quitarFiltro() {
    this.operacionesFiltradas = [...this.operacionesOriginal];
    this.fechaInicio = '';
    this.fechaFin = '';
    this.turnoAplicado = '';
    this.turnoSeleccionado = '';

    this.procesarTodo();
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

        return registros.map((estado: any) => {
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
            codigoOperacion: String(
              getOperacionEquipoModelo(operacion) ||
                getOperacionEquipoCodigo(operacion) ||
                operacion.id,
            ),
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
        });
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
        tipoOperacion: 'PERFORACIÓN TAL. LARGOS',
        fechaGeneracion: new Date(),
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // =========================
      // PÁGINA 1 (landscape): HOJA DE RESUMEN
      // =========================
      this.agregarPaginaResumenYGraficos(pdf);

      // =========================
      // PÁGINA 2 (landscape): RANKING Y MAPA DE CALOR
      // =========================
      this.agregarPaginaRankingYCalorPDF(pdf);

      // =========================
      // PÁGINA 3 (landscape): INDICADORES PRINCIPALES
      // =========================
      this.agregarPaginaIndicadoresPDF(pdf);

      // =========================
      // PÁGINA 4 (landscape): PERFORADO Y HORÓMETROS
      // =========================
      this.agregarPaginaPerforadoHorometrosPDF(pdf);

      // =========================
      // PÁGINAS SIGUIENTES (portrait): TABLAS
      // =========================
      pdf.addPage([210, 297], 'portrait');
      agregarCabeceraPDF(pdf, 'REPORTE OPERATIVO - TABLAS');
      let yTablas = 30;
      yTablas = this.agregarTablaPrimeraPerforacion(pdf, yTablas);
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

  private obtenerFechaArchivo(): string {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minuto = String(fecha.getMinutes()).padStart(2, '0');

    return `${anio}-${mes}-${dia}_${hora}-${minuto}`;
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
    const data = this.dataObservaciones || [];

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

  private agregarTablaPrimeraPerforacion(pdf: jsPDF, startY: number): number {
    const data = this.dataProcesoLaborFR || [];

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Sin datos para PRIMERA PERFORACIÓN');
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

    const columnas = ['Equipo', 'Fecha', 'Hora', 'Labor'];

    const filas = dataOrdenada.map((item: any) => [
      this.valorPDF(item.modelo_equipo),
      this.valorPDF(item.fecha),
      this.valorPDF(item.hora_inicio),
      this.valorPDF(item.labor_fr),
    ]);

    return agregarTablaContinuaPDF(pdf, {
      tituloReporte: 'REPORTE OPERATIVO - TABLAS',
      tituloTabla: 'HORAS PRIMERA PERFORACIÓN',
      columnas,
      filas,
      startY,
      marginLeft: 8,
      marginRight: 8,
    });
  }

  private obtenerParetosPDF() {
    const paretos = this.paretoCharts?.toArray() || [];

    return paretos.map((chart) => ({
      component: chart,
      title: chart.getChartTitle ? chart.getChartTitle() : 'GRÁFICO PARETO',
    }));
  }

  private agregarPaginaResumenYGraficos(pdf: jsPDF): void {
    agregarCabeceraPDF(pdf, 'REPORTE OPERATIVO - RESUMEN');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const marginX = 8;
    const startY = 28;
    const bottomMargin = 8;

    const gapX = 6;
    const gapY = 8;

    const cardWidth = (pageWidth - marginX * 2 - gapX * 2) / 3;
    const cardHeight = (pageHeight - startY - bottomMargin - gapY) / 2;

    const posiciones = [
      { x: marginX, y: startY },
      { x: marginX + cardWidth + gapX, y: startY },
      { x: marginX + (cardWidth + gapX) * 2, y: startY },

      { x: marginX, y: startY + cardHeight + gapY },
      { x: marginX + cardWidth + gapX, y: startY + cardHeight + gapY },
      { x: marginX + (cardWidth + gapX) * 2, y: startY + cardHeight + gapY },
    ];

    const charts = [
      null,
      { image: this.disparosEquipoChart, title: 'DISPAROS POR EQUIPO' },
      { image: this.rendimientoEquipoChart, title: 'RENDIMIENTO POR EQUIPO' },
      { image: this.metrosDisparoChart, title: 'METROS PERFORADOS/DISPARO' },
    ];

    this.agregarResumenPDF(pdf, this.resumen, {
      x: posiciones[0].x,
      y: posiciones[0].y,
      width: cardWidth,
      height: cardHeight,
    });

    for (let i = 1; i < charts.length; i++) {
      const chart = charts[i];
      if (!chart) continue;

      const image = chart.image.getChartImage({
        pixelRatio: 2,
        exportWidth: 800,
        exportHeight: 800,
        gridLeft: '6%',
        gridRight: '6%',
        gridTop: '12%',
        gridBottom: '0',
      });

      if (!image) continue;

      agregarGraficoEchartsPDFProporcional(
        pdf,
        image,
        chart.title,
        posiciones[i].x,
        posiciones[i].y,
        cardWidth,
        cardHeight,
      );
    }
  }

  private agregarPaginaRankingYCalorPDF(pdf: jsPDF): void {
    pdf.addPage([297, 210], 'landscape');
    agregarCabeceraPDF(pdf, 'REPORTE OPERATIVO - RANKING Y MAPA DE CALOR');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const marginX = 8;
    const startY = 28;
    const bottomMargin = 8;
    const gapY = 8;

    const cardWidth = pageWidth - marginX * 2;
    const cardHeight = (pageHeight - startY - bottomMargin - gapY) / 2;

    const rankingImage = this.rankingOperadorChart.getChartImage({
      pixelRatio: 2,
      exportWidth: 1400,
      exportHeight: undefined,
      gridLeft: '6%',
      gridRight: '4%',
      gridTop: '14%',
      gridBottom: '10%',
    });

    if (rankingImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        rankingImage,
        'RANKING OPERADOR',
        marginX,
        startY,
        cardWidth,
        cardHeight,
      );
    }

    const mapaImage = this.mapaDeCalorChart.getChartImage({
      pixelRatio: 2,
      exportWidth: undefined,
      exportHeight: undefined,
      gridLeft: '6%',
      gridRight: '6%',
      gridTop: '14%',
      gridBottom: '8%',
    });

    if (mapaImage) {
      agregarGraficoEchartsPDFProporcional(
        pdf,
        mapaImage,
        'MAPA DE CALOR - INICIACIÓN',
        marginX,
        startY + cardHeight + gapY,
        cardWidth,
        cardHeight,
      );
    }
  }

  private agregarPaginaIndicadoresPDF(pdf: jsPDF): void {
    pdf.addPage([297, 210], 'landscape');

    agregarCabeceraPDF(pdf, 'REPORTE OPERATIVO - INDICADORES PRINCIPALES');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const marginX = 8;
    const startY = 28;
    const bottomMargin = 8;
    const gapX = 6;
    const gapY = 8;

    const cardWidth = (pageWidth - marginX * 2 - gapX * 2) / 3;
    const cardHeight = (pageHeight - startY - bottomMargin - gapY) / 2;

    const charts = [
      { component: this.disparosDiaChart, title: 'DISPAROS POR DÍA' },
      ...this.obtenerParetosPDF().slice(0, 3),
      { component: this.perforadoEquipoChart, title: 'PERFORADO POR EQUIPO' },
      { component: this.mhrEquipoChart, title: 'M/HR POR EQUIPO' },
    ];

    const posiciones = [
      { x: marginX, y: startY },
      { x: marginX + cardWidth + gapX, y: startY },
      { x: marginX + (cardWidth + gapX) * 2, y: startY },
      { x: marginX, y: startY + cardHeight + gapY },
      { x: marginX + cardWidth + gapX, y: startY + cardHeight + gapY },
      { x: marginX + (cardWidth + gapX) * 2, y: startY + cardHeight + gapY },
    ];

    charts.slice(0, 6).forEach((chart, index) => {
      const image = chart.component.getChartImage({
        pixelRatio: 2,
        exportWidth: 800,
        exportHeight: 800,
        gridLeft: '6%',
        gridRight: '6%',
        gridTop: '12%',
        gridBottom: '0',
      });
      if (!image) return;

      agregarGraficoEchartsPDFProporcional(
        pdf,
        image,
        chart.title,
        posiciones[index].x,
        posiciones[index].y,
        cardWidth,
        cardHeight,
      );
    });
  }

  private agregarPaginaPerforadoHorometrosPDF(pdf: jsPDF): void {
    pdf.addPage([297, 210], 'landscape');

    agregarCabeceraPDF(pdf, 'REPORTE OPERATIVO - PERFORADO Y HORÓMETROS');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const marginX = 8;
    const startY = 28;
    const bottomMargin = 8;
    const gapX = 6;
    const gapY = 8;

    const cardWidth = (pageWidth - marginX * 2 - gapX * 2) / 3;
    const cardHeight = (pageHeight - startY - bottomMargin - gapY) / 2;

    const charts = [
      { component: this.horometrosJumbosChart, title: 'HORÓMETROS T. LARGOS' },
      { component: this.totalHorometrosChart, title: 'TOTAL HORÓMETROS' },
      {
        component: this.disparosTipoPerforacionChart,
        title: 'DISPAROS POR TIPO DE PERFORACIÓN',
      },
      {
        component: this.promedioEstadosChart,
        title: 'HORAS PROMEDIO POR ESTADO',
      },
    ];

    const posiciones = [
      { x: marginX, y: startY },
      { x: marginX + cardWidth + gapX, y: startY },
      { x: marginX + (cardWidth + gapX) * 2, y: startY },
      { x: marginX, y: startY + cardHeight + gapY },
      { x: marginX + cardWidth + gapX, y: startY + cardHeight + gapY },
      { x: marginX + (cardWidth + gapX) * 2, y: startY + cardHeight + gapY },
    ];

    charts.slice(0, 6).forEach((chart, index) => {
      const image = chart.component.getChartImage({
        pixelRatio: 2,
        exportWidth: 800,
        exportHeight: 800,
        gridLeft: '6%',
        gridRight: '6%',
        gridTop: '12%',
        gridBottom: '0',
      });
      if (!image) return;

      agregarGraficoEchartsPDFProporcional(
        pdf,
        image,
        chart.title,
        posiciones[index].x,
        posiciones[index].y,
        cardWidth,
        cardHeight,
      );
    });
  }

  private agregarResumenPDF(
    pdf: jsPDF,
    resumen: { label: string; value: number }[],
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
        value: this.formatearNumero(resumen?.[0]?.value, 0),
        unit: 'equipos',
      },
      {
        label: 'M/LABOR',
        value: this.formatearNumero(resumen?.[2]?.value, 2),
        unit: 'm/labor',
      },
      {
        label: 'LABORES PERF.',
        value: this.formatearNumero(resumen?.[3]?.value, 0),
        unit: 'labores',
      },
      {
        label: 'TOTAL PERF.',
        value: this.formatearNumero(resumen?.[1]?.value, 0),
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

  private formatearNumero(valor: any, decimales: number = 0): string {
    const numero = Number(valor || 0);

    return numero.toLocaleString('en-US', {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    });
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
  // =========================================
  // 🔥 PROCESAMIENTO TOTAL
  // =========================================
  procesarTodo() {
    if (!this.operacionesFiltradas.length) return;

    this.dataDisparosEquipo = this.procesarDisparosEquipo(); // 👈 NUEVO
    this.dataDisparosDia = this.procesarDisparosDia();
    this.dataIndicadoresEquipo = this.procesarIndicadoresEquipo();
    this.dataDemorasOperativas = this.procesarDemorasOperativas();
    this.dataHorasNoOperativas = this.procesarHorasNoOperativas();
    this.dataHorasMantenimiento = this.procesarHorasMantenimiento();

    this.dataParetoHorasOperativas = this.ParetoHorasOperativas();
    this.dataParetoHorasNoOperativas = this.ParetoHorasNoOperativas();
    this.dataParetoHorasMantenimiento = this.ParetoHorasMantenimiento();
    this.dataMetrosPerforadosDisparo = this.procesarMetrosPerforadosDisparo();

    this.dataPerforadoEquipo = this.procesarPerforadoEquipo();
    this.dataRendimientoEquipo = this.procesarRendimientoEquipo();
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
    this.dataTipoPerforacion = this.procesarTipoPerforacion();
    this.datadetalleDisparos = this.procesarDataPerforacionDetallada();
    this.dataHorasNumericas = this.procesarHorasNumericas();
    this.dataObservaciones = this.procesarObservaciones();
    this.procesarResumen();
    this.prepararDatosGraficoEstados();
  }

  contarFrentesCompletos(registrosArray: Registro<OperacionTLargos>[]): number {
    if (!Array.isArray(registrosArray)) return 0;

    let contador = 0;

    for (const registro of registrosArray) {
      if (this.esDisparoTalLargo(registro)) {
        contador++;
      }
    }

    return contador;
  }

  procesarDisparosEquipo(): DisparosEquipoChartItem[] {
    const mapaDisparos = new Map<string, DisparosEquipoChartItem>();

    this.operacionesFiltradas.forEach((op) => {
      try {
        const registrosArray = op.registros;
        if (!Array.isArray(registrosArray) || registrosArray.length === 0)
          return;

        const conteoTipos: Record<string, number> = {};

        for (const registro of registrosArray) {
          if (!this.esEstadoOperativoPorCodigo(registro.codigo)) continue;
          if (!registro.operacion) continue;

          const tipoLabel = registro.operacion.tipo_perforacion?.trim();
          if (!tipoLabel) continue;

          conteoTipos[tipoLabel] = (conteoTipos[tipoLabel] || 0) + 1;
        }

        const totalDisparos = Object.values(conteoTipos).reduce(
          (total, valor) => total + valor,
          0,
        );
        const key = getOperacionEquipoModelo(op);

        if (mapaDisparos.has(key)) {
          const existing = mapaDisparos.get(key)!;
          existing.totalDisparos += totalDisparos;
          existing.segmentos = this.acumularSegmentos(
            existing.segmentos,
            conteoTipos,
          );
        } else {
          mapaDisparos.set(key, {
            modeloEquipo: getOperacionEquipoModelo(op),
            seccion: getSeccionNombre(op.seccion),
            seccionLabor: this.obtenerSeccionLaborTalLargo(registrosArray),
            totalDisparos,
            segmentos: this.crearSegmentos(conteoTipos),
          });
        }
      } catch (error) {}
    });

    return Array.from(mapaDisparos.values());
  }
  procesarPerforadoEquipo(): PerforadoEquipoChartItem[] {
    const mapa = new Map<string, PerforadoEquipoChartItem>();

    this.operacionesFiltradas.forEach((op) => {
      try {
        const registrosArray = op.registros;
        if (!Array.isArray(registrosArray) || registrosArray.length === 0)
          return;

        let metrosPerforados = 0;

        for (const registro of registrosArray) {
          if (registro.estado !== 'OPERATIVO') continue;
          if (!registro.operacion) continue;
          metrosPerforados += this.obtenerMetrosPerforadosRegistro(
            registro.operacion,
          );
        }

        const key = getOperacionEquipoModelo(op);

        if (mapa.has(key)) {
          const existing = mapa.get(key)!;
          existing.metrosPerforados += metrosPerforados;
        } else {
          mapa.set(key, {
            modeloEquipo: getOperacionEquipoModelo(op),
            seccion: getSeccionNombre(op.seccion),
            metrosPerforados,
          });
        }
      } catch (error) {}
    });

    return Array.from(mapa.values());
  }

  procesarObservaciones(): ObservacionItem[] {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const modelo = getOperacionEquipoModelo(op);
      const operador = op.operador || 'SIN_OPERADOR';

      registrosArray.forEach((r) => {
        const operacion = r.operacion;
        if (!operacion) return;

        const tipo_labor = operacion.tipo_labor || '';
        const labor = operacion.labor || '';
        const ala = operacion.ala || '';

        const observaciones = operacion.observaciones;

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
  procesarRendimientoEquipo(): RendimientoEquipoChartItem[] {
    const mapa = new Map<
      string,
      {
        seccion: string;
        tiempoTotal: number;
        horasOperativas: number;
        horasDemora: number;
        horasReserva: number;
        horasFueraPlan: number;
        horasDemoraMecanica: number;
      }
    >();

    this.operacionesFiltradas.forEach((op) => {
      try {
        const registrosArray = op.registros;
        if (!Array.isArray(registrosArray) || registrosArray.length === 0)
          return;

        let tiempoTotal = 0;
        let horasOperativas = 0;
        let horasDemora = 0;
        let horasReserva = 0;
        let horasFueraPlan = 0;
        let horasDemoraMecanica = 0;

        for (const r of registrosArray) {
          if (!r.hora_inicio || !r.hora_final) continue;

          const duracion = this.calcularDuracionHoras(
            r.hora_inicio,
            r.hora_final,
          );
          if (!duracion || duracion <= 0) continue;

          const estado = String(r.estado || '')
            .trim()
            .toUpperCase();
          const codigo = String(r.codigo || '').trim();

          tiempoTotal += duracion;

          if (this.esEstadoOperativoPorCodigo(codigo)) {
            horasOperativas += duracion;
          }

          if (estado === 'DEMORA') {
            horasDemora += duracion;
          }

          if (estado === 'RESERVA') {
            horasReserva += duracion;
          }

          if (estado === 'FUERA DE PLAN' || estado === 'FUERA DE PLANTA') {
            horasFueraPlan += duracion;
          }

          if (this.esEstadoMantenimientoPorCodigo(codigo) || codigo === '206') {
            horasDemoraMecanica += duracion;
          }
        }

        const key = getOperacionEquipoModelo(op);

        if (mapa.has(key)) {
          const acc = mapa.get(key)!;
          acc.tiempoTotal += tiempoTotal;
          acc.horasOperativas += horasOperativas;
          acc.horasDemora += horasDemora;
          acc.horasReserva += horasReserva;
          acc.horasFueraPlan += horasFueraPlan;
          acc.horasDemoraMecanica += horasDemoraMecanica;
        } else {
          mapa.set(key, {
            seccion: getSeccionNombre(op.seccion),
            tiempoTotal,
            horasOperativas,
            horasDemora,
            horasReserva,
            horasFueraPlan,
            horasDemoraMecanica,
          });
        }
      } catch (error) {}
    });

    return Array.from(mapa.entries()).map(([key, acc]) => {
      const disponibilidadMecanica =
        acc.tiempoTotal > 0
          ? (acc.tiempoTotal - (acc.horasFueraPlan + acc.horasDemoraMecanica)) /
            acc.tiempoTotal
          : 0;

      const tiempoHabil =
        acc.horasOperativas + acc.horasDemora + acc.horasReserva;

      const utilizacionOperativa =
        tiempoHabil > 0 ? acc.horasOperativas / tiempoHabil : 0;

      return {
        modeloEquipo: key,
        seccion: acc.seccion,
        DM_FR: Number(disponibilidadMecanica.toFixed(3)),
        UTI_FR: Number(utilizacionOperativa.toFixed(3)),
      };
    });
  }

  private calcularHorasEfectivas(
    registrosArray: Registro<OperacionTLargos>[],
  ): number {
    if (!Array.isArray(registrosArray)) return 0;
    let total = 0;
    for (const r of registrosArray) {
      if (r.estado !== 'OPERATIVO') continue;
      if (!r.hora_inicio || !r.hora_final) continue;
      total += this.calcularDuracionHoras(r.hora_inicio, r.hora_final);
    }
    return total;
  }

  private obtenerMetrosPerforadosRegistro(operacion: OperacionTLargos): number {
    const prod = Number(operacion.metros_perforados_produccion) || 0;
    const rim = Number(operacion.metros_perforados_rimados) || 0;
    const ali = Number(operacion.metros_perforados_alivio) || 0;
    const rep = Number(operacion.metros_perforados_repaso) || 0;
    return Number((prod + rim + ali + rep).toFixed(2));
  }

  private esDisparoTalLargo(registro: Registro<OperacionTLargos>): boolean {
    if ((registro.estado || '').trim().toUpperCase() !== 'OPERATIVO') {
      return false;
    }

    const tipo = this.normalizarTipoPerforacion(
      this.obtenerTipoPerforacionTalLargo(registro.operacion),
    );
    return this.tiposDisparoTalLargo.has(tipo);
  }

  private obtenerTipoPerforacionTalLargo(
    operacion: OperacionTLargos | undefined | null,
  ): string {
    return (
      (operacion as OperacionTalLargoConTipo | undefined | null)
        ?.tipo_perforacion || ''
    ).trim();
  }

  private normalizarTipoPerforacion(tipo?: string): string {
    return (tipo || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toUpperCase();
  }

  private crearSegmentos(
    conteoTipos: Record<string, number>,
  ): DisparosEquipoSegmento[] {
    return Object.entries(conteoTipos)
      .map(([tipo, valor]) => ({ tipo, valor }))
      .filter((segmento) => segmento.valor > 0);
  }

  private acumularSegmentos(
    segmentosActuales: DisparosEquipoSegmento[],
    conteoTipos: Record<string, number>,
  ): DisparosEquipoSegmento[] {
    const acumulado = new Map<string, number>();

    segmentosActuales.forEach((segmento) => {
      acumulado.set(segmento.tipo, segmento.valor);
    });

    Object.entries(conteoTipos).forEach(([tipo, valor]) => {
      acumulado.set(tipo, (acumulado.get(tipo) || 0) + valor);
    });

    return Array.from(acumulado.entries()).map(([tipo, valor]) => ({
      tipo,
      valor,
    }));
  }

  private obtenerSeccionLaborTalLargo(
    registrosArray: Registro<OperacionTLargos>[],
  ): string {
    const primerRegistroOperativo = registrosArray.find((registro) =>
      this.esDisparoTalLargo(registro),
    );
    return primerRegistroOperativo?.operacion?.labor || 'SIN_SECCION';
  }

  private esEstadoOperativoPorCodigo(codigo: string): boolean {
    return this.ESTADOS_OPERATIVOS.includes(codigo);
  }

  private cargarTiposPerforacion(): void {
    this.apiService
      .getDatos<
        TipoPerforacion[]
      >('tipo-perforaciones/por-proceso?proceso=PERFORACIÓN TALADROS LARGOS')
      .subscribe({
        next: (tipos) => {
          this.tipoPerforacionMap = new Map(tipos.map((t) => [t.id, t.nombre]));
        },
        error: () => console.warn('Error al cargar tipos de perforación'),
      });
  }

  procesarDisparosDia(): DisparosDiaItem[] {
    const mapa = new Map<string, number>();

    this.operacionesFiltradas.forEach((op) => {
      try {
        const registrosArray = op.registros;

        if (Array.isArray(registrosArray) && registrosArray.length > 0) {
          const fecha = op.fecha || 'SIN_FECHA';
          const turno = op.turno || 'SIN_TURNO';

          const key = `${fecha}|${turno}`;

          const nFrentes = this.contarFrentesCompletos(registrosArray);

          if (mapa.has(key)) {
            mapa.set(key, mapa.get(key)! + nFrentes);
          } else {
            mapa.set(key, nFrentes);
          }
        }
      } catch (error) {
        //console.error('Error procesando operación para disparos día:', op.id, error);
      }
    });

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
        const diff = a.fecha.localeCompare(b.fecha);
        return diff !== 0 ? diff : a.turno.localeCompare(b.turno);
      });
  }

  procesarResumen() {
    let totalMetros = 0;
    let nDisparosTL = 0;
    const equiposSet = new Set<string>();

    this.operacionesFiltradas.forEach((op) => {
      equiposSet.add(getOperacionEquipoModelo(op));

      try {
        const registrosArray = op.registros;

        if (Array.isArray(registrosArray)) {
          for (const registro of registrosArray) {
            if (!this.esEstadoOperativoPorCodigo(registro.codigo)) continue;
            if (!registro.operacion) continue;

            const metrosRegistro = this.obtenerMetrosPerforadosRegistro(
              registro.operacion,
            );
            totalMetros += metrosRegistro;

            const tipoPerforacion = registro.operacion.tipo_perforacion?.trim();
            if (tipoPerforacion) {
              nDisparosTL++;
            }
          }
        }
      } catch (error) {
        //console.error('Error procesando operación:', op.id, error);
      }
    });

    const metrosPorDisparo = nDisparosTL > 0 ? totalMetros / nDisparosTL : 0;
    this.resumen = [
      { label: 'EQUIPOS', value: equiposSet.size },
      { label: 'TOTAL PERF. (m)', value: Number(totalMetros.toFixed(0)) },
      {
        label: 'METROS PERF./LABOR',
        value: Number(metrosPorDisparo.toFixed(0)),
      },
      { label: 'LABORES PERF.', value: nDisparosTL },
    ];
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

        const key = getOperacionEquipoModelo(op);

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
            seccion: getSeccionNombre(op.seccion),

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
      equiposUnicos.add(getOperacionEquipoModelo(op));

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
      equiposUnicos.add(getOperacionEquipoModelo(op));

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
      equiposUnicos.add(getOperacionEquipoModelo(op));

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

  getTiposEstadosMantenimiento(): Record<string, string> {
    return {
      '206': 'Inspección de equipo',
      '301': 'Mp inicial/final',
      '302': 'Mantenimiento programado',
      '303': 'Mantenimiento correctivo',
    };
  }

  private esEstadoNoOperativoPorCodigo(codigo: string): boolean {
    return this.ESTADOS_NO_OPERATIVOS.includes(codigo);
  }

  private esEstadoMantenimientoPorCodigo(codigo: string): boolean {
    return this.ESTADOS_MANTENIMIENTO.includes(codigo);
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

  private procesarParetoBase(
    filterFn: (codigo: string) => boolean,
  ): ParetoChartItem[] {
    const resultadoMap = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        const codigo = String(registro.codigo || '').trim();
        if (!codigo) continue;
        if (!filterFn(codigo)) continue;
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

    let resultado: ParetoChartItem[] = Array.from(resultadoMap.values()).map(
      (item) => ({
        actividad: item.actividad,
        horasDemora: Number(item.horasDemora.toFixed(2)),
        paretoAct: 0,
        porcentajeHoras: 0,
        totalHorasDemora: 0,
        cantidadRegistros: item.cantidadRegistros,
        codigos: Array.from(item.codigos),
      }),
    );

    resultado.sort((a, b) => {
      if (b.horasDemora !== a.horasDemora) return b.horasDemora - a.horasDemora;
      return String(a.actividad).localeCompare(String(b.actividad));
    });

    const totalHorasDemora = resultado.reduce(
      (sum, item) => sum + item.horasDemora,
      0,
    );

    let acumulado = 0;
    resultado = resultado.map((item) => {
      acumulado += item.horasDemora;

      return {
        ...item,
        paretoAct:
          totalHorasDemora > 0
            ? Number(((acumulado / totalHorasDemora) * 100).toFixed(2))
            : 0,
        porcentajeHoras:
          totalHorasDemora > 0
            ? Number(((item.horasDemora / totalHorasDemora) * 100).toFixed(2))
            : 0,
        totalHorasDemora: Number(totalHorasDemora.toFixed(2)),
      };
    });

    return resultado;
  }

  ParetoHorasOperativas(): ParetoChartItem[] {
    return this.procesarParetoBase((codigo) =>
      this.esEstadoOperativoPorCodigo(codigo),
    );
  }

  ParetoHorasNoOperativas(): ParetoChartItem[] {
    return this.procesarParetoBase((codigo) =>
      this.esEstadoNoOperativoPorCodigo(codigo),
    );
  }

  ParetoHorasMantenimiento(): ParetoChartItem[] {
    return this.procesarParetoBase((codigo) =>
      this.esEstadoMantenimientoPorCodigo(codigo),
    );
  }

  procesarMetrosPerforadosDisparo(): MetrosPerforadosDisparoItem[] {
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

        const key = `${getOperacionEquipoModelo(op)}-${getSeccionNombre(op.seccion)}`;

        const nFrentes = this.contarFrentesCompletos(registrosArray);
        let metros = 0;
        for (const r of registrosArray) {
          if (r.estado === 'OPERATIVO' && r.operacion) {
            metros += this.obtenerMetrosPerforadosRegistro(r.operacion);
          }
        }

        if (mapa.has(key)) {
          const existing = mapa.get(key)!;

          existing.n_frentes += nFrentes;
          existing.metros_perforados += metros;
        } else {
          mapa.set(key, {
            modelo_equipo: getOperacionEquipoModelo(op),
            seccion: getSeccionNombre(op.seccion),
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

  procesarMhrEquipo(): MhrEquipoItem[] {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const key = getOperacionEquipoModelo(op);

      let metros = 0;
      for (const r of registrosArray) {
        if (r.estado === 'OPERATIVO' && r.operacion) {
          metros += this.obtenerMetrosPerforadosRegistro(r.operacion);
        }
      }

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

  procesarHorometrosJumbos(): HorometroEquipoItem[] {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const key = getOperacionEquipoModelo(op);

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

      const key = getOperacionEquipoModelo(op);
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

      const key = getOperacionEquipoModelo(op);
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

      const key = getOperacionEquipoModelo(op);
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

      // console.log(`\n🔥 EQUIPO: ${equipo}`);
      // console.log(`días:`, dias);
      // console.log(`promedio última perf:`, promedio);

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

      const key = getOperacionEquipoModelo(op);
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

  procesarLaborFR(): HoraPrimeraPerforacionItem[] {
    const mapa = new Map<string, Map<string, any>>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const modelo = getOperacionEquipoModelo(op);
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
      const key = getOperacionEquipoModelo(op);
      const registrosArray = op.registros;

      // =========================
      // 🔥 METROS PERFORADOS
      // =========================
      let metros = 0;
      if (Array.isArray(registrosArray)) {
        for (const r of registrosArray) {
          if (r.estado === 'OPERATIVO' && r.operacion) {
            metros += this.obtenerMetrosPerforadosRegistro(r.operacion);
          }
        }
      }

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

          //const lb = Number(opData?.long_barras);
          const lb = 1;
          // ✅ SOLO valores válidos
          if (!isNaN(lb) && lb > 0) {
            item.sum_long_barras += lb;
            item.count_long_barras += 1;
          }

          /* item.tal_alivio += Number(opData?.metros_perforados_alivio) || 0;
          item.tal_prod += Number(opData?.metros_perforados_produccion) || 0;
          item.tal_repaso += Number(opData?.metros_perforados_repaso) || 0;
          item.tal_rimados += Number(opData?.metros_perforados_rimados) || 0; */
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

  procesarFrPorOperadorTurno(): RankingOperadorItem[] {
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
      let metros = 0;
      for (const r of registrosArray) {
        if (r.estado === 'OPERATIVO' && r.operacion) {
          metros += this.obtenerMetrosPerforadosRegistro(r.operacion);
        }
      }

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
  // grafico 20
  // =========================================
  procesarTipoPerforacion(): DisparosTipoPerforacionItem[] {
    const mapa = new Map<string, DisparosTipoPerforacionItem>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      registrosArray.forEach((r) => {
        const operacion = r?.operacion;

        const tipoPerforacion = ((operacion as any)?.tipo_perforacion || '')
          .toString()
          .trim()
          .toUpperCase();

        const key = `${getOperacionEquipoModelo(op)}-${tipoPerforacion}`;

        if (!mapa.has(key)) {
          mapa.set(key, {
            modelo_equipo: getOperacionEquipoModelo(op),
            tipo_perforacion: tipoPerforacion,
            n_disparos: 0,
          });
        }

        const item = mapa.get(key)!;
        item.n_disparos += 1;
      });
    });

    return Array.from(mapa.values());
  }

  procesarDataPerforacionDetallada() {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const key = getOperacionEquipoModelo(op);
      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      registrosArray.forEach((r) => {
        const operacion = r.operacion;
        if (!operacion) return;
        const tipo_perforacion = operacion.tipo_perforacion;
        if (!tipo_perforacion) return;

        const labor_fr =
          `${operacion?.tipo_labor ?? ''}${operacion?.labor ?? ''}${operacion?.ala ?? ''}`.trim() ||
          'S/LABOR';

        const metros = this.obtenerMetrosPerforadosRegistro(operacion);

        const long_barras = Number(operacion?.long_barras) || 0;
        const tal_alivio = Number(operacion?.n_taladros_alivio) || 0;
        const tal_prod = Number(operacion?.n_taladros_produccion) || 0;
        const tal_repaso = Number(operacion?.n_taladros_repaso) || 0;
        const tal_rimados = Number(operacion?.n_taladros_rimados) || 0;

        const mapKey = `${key}-${tipo_perforacion}-${labor_fr}`;

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

    return Array.from(mapa.values());
  }

  // =========================================
  // GRAFICO 22
  // =========================================

  procesarHorasNumericas(): MapaDeCalorItem[] {
    const result: any[] = [];

    this.operacionesFiltradas.forEach((op) => {
      const modelo = getOperacionEquipoModelo(op);
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
}
