import { Component, OnInit } from '@angular/core';
import { OperacionBaseScoop } from '../../../../../models/OperacionBase.models';
import { PlanProduccion } from '../../../../../models/plan_produccion.model';
import { PlanMensualService } from '../../../../../services/plan-mensual.service';
import { FechasPlanMensualService } from '../../../../../services/fechas-plan-mensual.service';
import { OperacionesService } from '../../../../../services/operaciones.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoService } from '../../../../../services/estado.service';
import { DisponibilidadDiaComponent } from '../Graficos components/Disponibilidad/disponibilidad-dia/disponibilidad-dia.component';
import { DisponibilidadEquipoComponent } from '../Graficos components/Disponibilidad/disponibilidad-equipo/disponibilidad-equipo.component';
import { DisponibilidadEstadoComponent } from '../Graficos components/Disponibilidad/disponibilidad-estado/disponibilidad-estado.component';
import { DisponibilidadGuardiaComponent } from '../Graficos components/Disponibilidad/disponibilidad-guardia/disponibilidad-guardia.component';
import { DisponibilidadMesComponent } from '../Graficos components/Disponibilidad/disponibilidad-mes/disponibilidad-mes.component';
import { DisponibilidadSemanaComponent } from '../Graficos components/Disponibilidad/disponibilidad-semana/disponibilidad-semana.component';
import { RendimientoGeneralComponent } from '../Graficos components/Rendimiento/rendimiento-general/rendimiento-general.component';
import { RendimientoGuardiaComponent } from "../Graficos components/Rendimiento/rendimiento-guardia/rendimiento-guardia.component";
import { RendimientoSeccionLaborComponent } from "../Graficos components/Rendimiento/rendimiento-seccion-labor/rendimiento-seccion-labor.component";
import { RendimientoMesAnoComponent } from "../Graficos components/Rendimiento/rendimiento-mes-ano/rendimiento-mes-ano.component";
import { TopEquiposComponent } from "../Graficos components/Rendimiento/top-equipos/top-equipos.component";
import { RendimientoDiaMesComponent } from "../Graficos components/Rendimiento/rendimiento-dia-mes/rendimiento-dia-mes.component";
import { RankingOperadorUtilizacionComponent } from "../Graficos components/Ranking operador/ranking-operador-utilizacion/ranking-operador-utilizacion.component";
import { RankingOperadorRendimientoComponent } from "../Graficos components/Ranking operador/ranking-operador-rendimiento/ranking-operador-rendimiento.component";
import { UtilizacionEquipoComponent } from "../Graficos components/Utilizacion/utilizacion-equipo/utilizacion-equipo.component";
import { UtilizacionSemanaComponent } from "../Graficos components/Utilizacion/utilizacion-semana/utilizacion-semana.component";
import { UtilizacionMesComponent } from "../Graficos components/Utilizacion/utilizacion-mes/utilizacion-mes.component";
import { UtilizacionGuardiaComponent } from "../Graficos components/Utilizacion/utilizacion-guardia/utilizacion-guardia.component";
import { HorasDemoraCodigoComponent } from "../Graficos components/Utilizacion/horas-demora-codigo/horas-demora-codigo.component";
import { UtilizacionDiaMesComponent } from "../Graficos components/Utilizacion/app-utilizacion-dia-mes/app-utilizacion-dia-mes.component";
import { DisponibilidadRankingGuardiaComponent } from "../Graficos components/Ranking Guardia/disponibilidad-guardia/disponibilidad-guardia.component";
import { MineralRankingGuardiaComponent } from "../Graficos components/Ranking Guardia/mineral-guardia/mineral-guardia.component";
import { RendimientoRankingGuardiaComponent } from "../Graficos components/Ranking Guardia/rendimiento-guardia/rendimiento-guardia.component";
import { UtilizacionRankingGuardiaComponent } from "../Graficos components/Ranking Guardia/utilizacion-guardia/utilizacion-guardia.component";
import { PromediosMaterialesEquipoComponent } from "../Graficos components/Ranking Guardia/promedios-materiales-equipo/promedios-materiales-equipo.component";
import { PromedioMaterialGuardiaComponent } from "../Graficos components/Ranking Guardia/promedio-material-guardia/promedio-material-guardia.component";
import { ParetoNoProgramadasComponent } from "../Graficos components/Dis_Pareto_Detalle/pareto-no-programada/pareto-no-programada.component";
import { DiagramaParetoComponent } from "../Graficos components/Util_Pareto_Detalle/diagrama-pareto/diagrama-pareto.component";
import { MtbfEquipoComponent } from '../Graficos components/MTBF-MTTR/MTBF/mtbf-equipo/mtbf-equipo.component';
import { MtbfSemanasComponent } from '../Graficos components/MTBF-MTTR/MTBF/mtbf-semanas/mtbf-semanas.component';
import { MtbfAnoComponent } from '../Graficos components/MTBF-MTTR/MTBF/mtbf-ano/mtbf-ano.component';
import { MtbfMesComponent } from '../Graficos components/MTBF-MTTR/MTBF/mtbf-mes/mtbf-mes.component';
import { MttrEquipoComponent } from "../Graficos components/MTBF-MTTR/MTTR/mttr-equipo/mttr-equipo.component";
import { MttrAnoComponent } from "../Graficos components/MTBF-MTTR/MTTR/mttr-ano/mttr-ano.component";
import { MttrSemanasComponent } from "../Graficos components/MTBF-MTTR/MTTR/mttr-semanas/mttr-semanas.component";
import { MttrMesComponent } from "../Graficos components/MTBF-MTTR/MTTR/mttr-mes/mttr-mes.component";
import { EquipoService } from '../../../../../services/equipo.service';
import { Equipo } from '../../../../../models/equipo.model';
import { MatDialog } from '@angular/material/dialog';
import { PresentacionDialogComponent } from '../presentacion-dialog/presentacion-dialog.component';
import { HorasOperativasDiaComponent } from '../Graficos components/HorasOperativas/horas-operativas-dia/horas-operativas-dia.component';
import { HorasOperativasMesComponent } from '../Graficos components/HorasOperativas/horas-operativas-mes/horas-operativas-mes.component';
import { HorasOperativasSemanaComponent } from '../Graficos components/HorasOperativas/horas-operativas-semana/horas-operativas-semana.component';
import { DashboardFiltrosComponent } from '../../../../../features/dashboard/components/dashboard-filtros/dashboard-filtros.component';
import {
  FiltrosDashboard,
  OpcionFiltroDashboard,
  TipoFiltroDashboard,
} from '../../../../../features/dashboard/models/dashboard-filtros.model';
import { generarDiasEntreFechas, MESES_CORTOS, obtenerPeriodo, obtenerPeriodoDesdeKey, obtenerRangoSemanaISO, obtenerSemanaISO, parseFechaLocal, parseFechaSimple } from '../../../../../utils/fecha-utils';



@Component({
  selector: 'app-principal-grafico-scoops',
  imports: [
    CommonModule,
    FormsModule,
    DashboardFiltrosComponent,
    //DisponibilidadEquipoComponent,
    //DisponibilidadSemanaComponent,
    //DisponibilidadMesComponent,
    //DisponibilidadGuardiaComponent,
    // DisponibilidadEstadoComponent,
    //DisponibilidadDiaComponent,
    //HorasOperativasDiaComponent,
    //HorasOperativasSemanaComponent,
    //HorasOperativasMesComponent,
],
  templateUrl: './principal-grafico-scoops.component.html',
  styleUrl: './principal-grafico-scoops.component.css',
})
export class PrincipalGraficoScoopsComponent implements OnInit {
  anio!: number;
  mes!: string;
  showZoom: boolean = false;

  // DATA ORIGINAL (sin filtrar)
  operacionesOriginal: OperacionBaseScoop[] = [];
  operacionesFiltradas: OperacionBaseScoop[] = [];
  planesMensuales: PlanProduccion[] = [];

  fechaInicio: string = '';
  fechaFin: string = '';
  turnoSeleccionado: string = '';
  turnoAplicado: string = '';
  cargandoPDF = false;
  tipoFiltro: TipoFiltroDashboard = 'dia';
  anioSeleccionado: Date | null = null;
  mesSeleccionado: Date | null = null;
  semanaSeleccionada: Date | null = null;
  diaSeleccionado: Date | null = null;
  rangoFechas: Date[] | null = null;
  tiposFiltro: OpcionFiltroDashboard[] = [
    { label: 'Rango', value: 'rango' },
    { label: 'Año', value: 'anio' },
    { label: 'Mes', value: 'mes' },
    { label: 'Semana', value: 'semana' },
    { label: 'Día', value: 'dia' },
  ];

  //DATA
DataDisponibilidadPorEquipo: any[] = [];
DataDisponibilidadPorSemana: any[] = [];
DataDisponibilidadPorMes: any[] = [];
DataDisponibilidadPorDia: any[] = [];
DataDisponibilidadPorSeccion: any[] = [];
DataParetoDisponibilidad: any[] = [];
DataUtilizacionPorEquipo: any[] = [];
DataUtilizacionPorSemana: any[] = [];
DataUtilizacionPorMes: any[] = [];
DataUtilizacionPorDia: any[] = [];
DataUtilizacionPorSeccionDetallada: any[] = [];
DataParetoUtilizacion: any[] = [];
DataRendimientoPorSeccionDetallado: any[] = [];
DataprocesarEquiposConCapacidad: any[] = [];
DataRendimientoPorMes: any[] = [];
DataRendimientoPorDia: any[] = [];
DataDisponibilidadPorOperador: any[] = [];

DataRendimientoPorOperador: any[] = [];
DataHorasPorObservacion: any[] = [];
DataHorasDemoraPorCodigoCompleto: any[] = [];

DataMTBFPorEquipo: any[] = [];
DataMTBFPorAnio: any[] = [];
DataMTBFPorSemanas: any[] = [];
DataMTBFPorMes: any[] = [];
DataMTTRPorEquipo: any[] = [];
DataMTTRPorAnio: any[] = [];
DataMTTRPorSemanas: any[] = [];
DataMTTRPorMes: any[] = [];

DataDisponiblidadPorGuardia: any[] = [];
DataRendimientoPorGuardia: any[] = [];
DataMineralGuardia: any[] = [];
DataUtilizacionGuardia: any[] = [];
DataToneladasPorHora: any[] = [];
DataToneladasPorEquipoYRangoHora: any[] = [];

  estadosProceso: any[] = [];
vistaPrincipal: boolean = true;

importandoExcel = false;
equiposProceso: Equipo[] = [];

dataHorasOperativasDia: any[] = [];
dataHorasOperativasSemana: any[] = [];
dataHorasOperativasMes: any[] = [];

constructor(
    private planMensualService: PlanMensualService,
    private fechasPlanMensualService: FechasPlanMensualService,
    private operacionesService: OperacionesService,
        private estadoService: EstadoService,
        //private excelImportService: ExcelImportService,
        private equipoService: EquipoService,
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
    this.obtenerEstadosPorProceso('SCOOPTRAM');
    this.obtenerEquiposPorProceso('SCOOPTRAM');
  }

  toggleDataZoom(): void {
    this.showZoom = !this.showZoom;
  }

  Presentacion() {
  if (!this.operacionesFiltradas || this.operacionesFiltradas.length === 0) {
    console.warn('No hay datos filtrados para mostrar');
    return;
  }

  const dialogRef = this.dialog.open(PresentacionDialogComponent, {
    width: '1800px',
    maxHeight: '90vh',
    data: {
      operaciones: this.operacionesFiltradas,
      turnoAplicado: this.turnoAplicado,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      equipos: this.equiposProceso,
    },
    disableClose: false,
    autoFocus: true
  });

  // Opcional: Escuchar cuando se cierre el diálogo
  dialogRef.afterClosed().subscribe(result => {
    console.log('Diálogo cerrado', result);
  });
}

  obtenerEquiposPorProceso(proceso: string) {
  this.equipoService.getEquiposByProceso(proceso)
    .subscribe({
      next: (data) => {
        this.equiposProceso = data;

        console.log('Equipos por proceso:', data);
      },
      error: (err) => {
        console.error('Error al traer equipos por proceso', err);
      }
    });
}

  obtenerEstadosPorProceso(proceso: string) {
  this.estadoService.getEstadosByProceso(proceso)
    .subscribe({
      next: (data) => {
        this.estadosProceso = data;
       //console.log('Estados por proceso:', data);

        // 🔥 CLAVE
        this.construirMapaEstados();
      },
      error: (err) => {
        console.error('Error al traer estados por proceso', err);
      }
    });
}

toggleVista() {
  this.vistaPrincipal = !this.vistaPrincipal;
}

aplicarFiltrosDashboard(filtros: FiltrosDashboard) {
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

  this.aplicarFiltro();
}

construirMapaEstados() {
  this.mapaEstados.clear();

  this.estadosProceso.forEach(e => {
    const codigo = String(e.codigo || '').trim();
    this.mapaEstados.set(codigo, e);
  });

 //console.log('🧩 Mapa de estados construido:', this.mapaEstados.size);
}

mapaEstados: Map<string, any> = new Map();

  cargarOperaciones() {
    const tipo = 'carguio';

    this.operacionesService.getAllAprobados(tipo).subscribe({
      next: (resp) => {
        this.operacionesOriginal = resp.data;

        console.log('🔥 DATA OPERACIONES:', this.operacionesOriginal);

        // 🔥 SOLO ESTO
        this.aplicarFiltro();
      },
      error: (err) => {
        //console.error('❌ Error al obtener operaciones:', err);
      },
    });
  }

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
        console.log('🔥 PLANES MENSUALES:', this.planesMensuales);

        this.procesarTodo();
      },
      error: (error) => {
        //console.error('❌ Error al obtener planes mensuales:', error);
      },
    });
  }

  procesarTodo() {
  if (!this.operacionesFiltradas.length || !this.planesMensuales.length)
    return;

  // 🔥 DISPONIBILIDAD
  this.DataDisponibilidadPorEquipo = this.DisponibilidadPorEquipo();
  this.DataDisponibilidadPorSemana = this.DisponibilidadPorSemana();
  this.DataDisponibilidadPorMes = this.DisponibilidadPorMes();
  this.DataParetoDisponibilidad = this.ParetoDisponibilidad();
  this.DataDisponibilidadPorDia = this.DisponibilidadPorDia();
  this.DataDisponibilidadPorSeccion = this.DisponibilidadPorSeccion();
  //UTILIZACION
  this.DataUtilizacionPorEquipo = this.UtilizacionPorEquipo();
  this.DataUtilizacionPorSemana = this.UtilizacionPorSemana();
  this.DataUtilizacionPorMes = this.UtilizacionPorMes();
  this.DataUtilizacionPorDia = this.UtilizacionPorDia();
  this.DataUtilizacionPorSeccionDetallada = this.UtilizacionPorSeccionDetallada();
  this.DataParetoUtilizacion = this.ParetoUtilizacion();
  //RENDIMIENTO
  //this.DataRendimientoPorSeccionDetallado = this.RendimientoPorSeccionDetallado();
  //this.DataprocesarEquiposConCapacidad = this.RendimientoPorEquipo();
  //this.DataRendimientoPorMes = this.RendimientoPorMes();
  //this.DataRendimientoPorDia = this.RendimientoPorDia();
  //RANKING OPERADOR
   //DIS_PARETO DETALLE
  this.DataHorasPorObservacion = this.HorasPorObservacion();

  //UTIL_PARETO DETALLE
  this.DataHorasDemoraPorCodigoCompleto = this.HorasDemoraPorCodigoCompleto();

  // MTBF - MTTR
  this.DataMTBFPorEquipo = this.MTBFPorEquipo();
  this.DataMTBFPorAnio = this.MTBFPorAño();
  this.DataMTBFPorSemanas = this.MTBFPorSemana();
  this.DataMTBFPorMes = this.MTBFPorMes();
  this.DataMTTRPorEquipo = this.MTTRPorEquipo();
  this.DataMTTRPorAnio = this.MTTRPorAño();
  this.DataMTTRPorSemanas = this.MTTRPorSemana();
  this.DataMTTRPorMes = this.MTTRPorMes();

  // Ranking Guardia
  this.DataDisponiblidadPorGuardia = this.DisponibilidadPorGuardia();
  this.DataUtilizacionGuardia = this.UtilizacionGuardia();


  this.DataDisponibilidadPorOperador = this.DisponibilidadPorOperador();
  //this.DataRendimientoPorOperador = this.RendimientoPorOperador();


  // this.DataToneladasPorHora = this.ToneladasPorRangoHoraCompleto() 
   //this.DataToneladasPorEquipoYRangoHora = this.ToneladasPorEquipoYRangoHora(this.turnoSeleccionado);
  this.dataHorasOperativasDia = this.HorasOperativasPorDia();
  this.dataHorasOperativasSemana = this.HorasOperativasPorSemana();
  this.dataHorasOperativasMes = this.HorasOperativasPorMes();
}

  // =========================================
  // 🔥 FILTRO POR FECHA
  // =========================================
  aplicarFiltro() {
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

  quitarFiltro() {
    this.operacionesFiltradas = [...this.operacionesOriginal];
    this.fechaInicio = '';
    this.fechaFin = '';
    this.turnoAplicado = '';
    this.turnoSeleccionado = '';

    this.procesarTodo();
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
      this.fechaInicio = this.formatearFecha(this.diaSeleccionado);
      this.fechaFin = this.formatearFecha(this.diaSeleccionado);
      return true;
    }

    if (this.tipoFiltro === 'mes') {
      if (!this.mesSeleccionado) return false;
      const anio = this.mesSeleccionado.getFullYear();
      const mes = this.mesSeleccionado.getMonth();
      this.fechaInicio = this.formatearFecha(new Date(anio, mes, 1));
      this.fechaFin = this.formatearFecha(new Date(anio, mes + 1, 0));
      return true;
    }

    if (this.tipoFiltro === 'semana') {
      if (!this.semanaSeleccionada) return false;
      const inicio = new Date(this.semanaSeleccionada);
      const dia = inicio.getDay() || 7;
      inicio.setDate(inicio.getDate() - dia + 1);
      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);
      this.fechaInicio = this.formatearFecha(inicio);
      this.fechaFin = this.formatearFecha(fin);
      return true;
    }

    if (this.tipoFiltro === 'rango') {
      if (!this.rangoFechas || this.rangoFechas.length < 2) return false;
      const [inicio, fin] = this.rangoFechas;
      if (!inicio || !fin) return false;
      this.fechaInicio = this.formatearFecha(inicio);
      this.fechaFin = this.formatearFecha(fin);
      return true;
    }

    return false;
  }

  private formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  async generarPDF() {
    this.cargandoPDF = true;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const todasLasPaginas = document.querySelectorAll('[data-page]');
      const elementosPorPagina = new Map<number, Element[]>();

      todasLasPaginas.forEach((el) => {
        const page = parseInt(el.getAttribute('data-page') || '1');
        if (!elementosPorPagina.has(page)) {
          elementosPorPagina.set(page, []);
        }
        elementosPorPagina.get(page)!.push(el);
      });

      for (const [pageNum, elementos] of Array.from(
        elementosPorPagina.entries(),
      )) {
        if (pageNum > 1) pdf.addPage();

        todasLasPaginas.forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });

        elementos.forEach((el) => {
          (el as HTMLElement).style.display = 'block';
        });

        await this.delay(300);

        const container = document.querySelector(
          '.graficos-container',
        ) as HTMLElement;

        if (container) {
          const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
          });

          const imgData = canvas.toDataURL('image/png');
          const imgHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        }
      }

      todasLasPaginas.forEach((el) => {
        (el as HTMLElement).style.display = '';
      });

      pdf.save('grafico_completo_tal_largo.pdf');
    } finally {
      this.cargandoPDF = false;
    }
  }
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //=========================================
  //HOJA 1
  //=========================================
//GRAFICO 1 - DISPONIBILIDAD POR EQUIPO
  DisponibilidadPorEquipo() {
  const resultadoMap = new Map<string, any>();

  this.operacionesFiltradas.forEach((op) => {
    const modeloEquipo = `${op.n_equipo}`;
    const HORAS_TOTALES = 12;
    let horasMtto = 0;

    const registrosArray = op.registros;
    if (!Array.isArray(registrosArray)) return;

    for (const registro of registrosArray) {
      if (registro.estado !== 'MANTENIMIENTO') continue;
      
      const horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final!
      );
      horasMtto += horas;
    }

    horasMtto = Math.min(horasMtto, HORAS_TOTALES);

    if (!resultadoMap.has(modeloEquipo)) {
      resultadoMap.set(modeloEquipo, {
        modeloEquipo,
        horasTotales: 0,
        horasMtto: 0,
        disponibilidad: 0,
        cantidadPartes: 0
      });
    }

    const item = resultadoMap.get(modeloEquipo);
    item.horasTotales += HORAS_TOTALES;
    item.horasMtto += horasMtto;
    item.cantidadPartes += 1;

    // 🔥 CON SI.ERROR - usando try-catch
    try {
      const disponibilidadActual = ((item.horasTotales - item.horasMtto) / item.horasTotales) * 100;
      item.disponibilidad = Number(disponibilidadActual.toFixed(2));
    } catch (error) {
      item.disponibilidad = 0; // 🔥 como el SI.ERROR
    }
  });

  const resultado = Array.from(resultadoMap.values());
  // console.log('📊 DISPONIBILIDAD POR EQUIPO:', resultado);
  return resultado;
}

private calcularDuracionHoras(
  horaInicio: string,
  horaFinal: string
): number {

  if (!horaInicio || !horaFinal) return 0;

  const [h1, m1] = horaInicio.split(':').map(Number);
  const [h2, m2] = horaFinal.split(':').map(Number);

  let inicio = h1 * 60 + m1;
  let fin = h2 * 60 + m2;

  // 🔥 cruza medianoche
  if (fin < inicio) {
    fin += 24 * 60;
  }

  return Number(((fin - inicio) / 60).toFixed(2));
}



private obtenerNumeroSemana(fecha: string): number {

  const date = new Date(fecha);

  // 🔥 inicio año
  const inicioAnio = new Date(date.getFullYear(), 0, 1);

  // 🔥 días transcurridos
  const dias =
    Math.floor(
      (
        date.getTime() -
        inicioAnio.getTime()
      ) / 86400000
    );

  // 🔥 semana del año
  return Math.ceil((dias + inicioAnio.getDay() + 1) / 7);
}


  DisponibilidadPorDia() {
    return this.calcularDisponibilidadBasePorDia(
      this.operacionesFiltradas,
      true,
    );
  }

  DisponibilidadPorSemana() {
    return this.calcularDisponibilidadPorPeriodoVisual('SEMANA');
  }

  DisponibilidadPorMes() {
    return this.calcularDisponibilidadPorPeriodoVisual('MES');
  }
  private calcularDisponibilidadPorPeriodoVisual(tipo: 'SEMANA' | 'MES') {
    const resultadoMap = this.crearPeriodosVisiblesDisponibilidad(tipo);

    // Usa operacionesOriginal para que fechaInicio y fechaFin NO afecten el cálculo
    // Solo se filtra por turno, si corresponde
    const dataCalculo = this.filtrarSoloPorTurno(this.operacionesOriginal);

    const datosPorDia = this.calcularDisponibilidadBasePorDia(
      dataCalculo,
      false,
    );

    datosPorDia.forEach((dia) => {
      const periodo = obtenerPeriodoDesdeKey(dia.key, tipo);

      if (!periodo) return;

      // Solo muestra semanas/meses dentro del rango visual seleccionado
      if (!resultadoMap.has(periodo.key)) return;

      const item = resultadoMap.get(periodo.key);

      item.horasTotales += Number(dia.horasTotales || 0);
      item.horasMtto += Number(dia.horasMtto || 0);
      item.horasDisponibles += Number(dia.horasDisponibles || 0);

      item.cantidadOperaciones += Number(dia.cantidadOperaciones || 0);
      item.cantidadRegistros += Number(dia.cantidadRegistros || 0);
      item.cantidadRegistrosMtto += Number(dia.cantidadRegistrosMtto || 0);
    });

    const resultado = Array.from(resultadoMap.values()).map((item) => {
      if (item.horasTotales > 0) {
        item.disponibilidad = Number(
          ((item.horasDisponibles / item.horasTotales) * 100).toFixed(2),
        );
      } else {
        item.disponibilidad = 0;
      }

      item.horasTotales = Number(item.horasTotales.toFixed(2));
      item.horasMtto = Number(item.horasMtto.toFixed(2));
      item.horasDisponibles = Number(item.horasDisponibles.toFixed(2));

      return item;
    });

    resultado.sort((a, b) => String(a.key).localeCompare(String(b.key)));

    return resultado;
  }
  private crearPeriodosVisiblesDisponibilidad(tipo: 'SEMANA' | 'MES') {
    const resultadoMap = new Map<string, any>();

    if (!this.fechaInicio || !this.fechaFin) {
      return resultadoMap;
    }

    const diasRango = generarDiasEntreFechas(this.fechaInicio, this.fechaFin);

    diasRango.forEach((dia) => {
      const periodo = obtenerPeriodoDesdeKey(dia.key, tipo);

      if (!periodo) return;

      if (!resultadoMap.has(periodo.key)) {
        resultadoMap.set(periodo.key, {
          key: periodo.key,
          periodo: periodo.label,
          anio: periodo.anio || null,
          fechaInicio: periodo.fechaInicio || null,
          fechaFin: periodo.fechaFin || null,

          horasTotales: 0,
          horasMtto: 0,
          horasDisponibles: 0,
          disponibilidad: 0,

          cantidadDiasRango: 0,

          cantidadOperaciones: 0,
          cantidadRegistros: 0,
          cantidadRegistrosMtto: 0,
        });
      }

      const item = resultadoMap.get(periodo.key);
      item.cantidadDiasRango += 1;
    });

    return resultadoMap;
  }
  private calcularDisponibilidadBasePorDia(
    dataOperaciones: OperacionBaseScoop[],
    crearRangoVisual: boolean,
  ) {
    const resultadoMap = new Map<string, any>();

    // Solo para DisponibilidadPorDia:
    // crea todos los días del rango seleccionado, incluso si no tienen data
    if (crearRangoVisual && this.fechaInicio && this.fechaFin) {
      const diasRango = generarDiasEntreFechas(this.fechaInicio, this.fechaFin);

      diasRango.forEach((dia) => {
        resultadoMap.set(dia.key, {
          key: dia.key,
          periodo: dia.label,

          horasTotales: 0,
          horasMtto: 0,
          horasDisponibles: 0,
          disponibilidad: 0,

          cantidadOperaciones: 0,
          cantidadRegistros: 0,
          cantidadRegistrosMtto: 0,
        });
      });
    }

    dataOperaciones.forEach((op) => {
      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      const fecha = op.fecha;

      if (!fecha) return;

      const periodo = obtenerPeriodo(fecha, 'DIA');

      if (!periodo) return;

      if (!resultadoMap.has(periodo.key)) {
        resultadoMap.set(periodo.key, {
          key: periodo.key,
          periodo: periodo.label,

          horasTotales: 0,
          horasMtto: 0,
          horasDisponibles: 0,
          disponibilidad: 0,

          cantidadOperaciones: 0,
          cantidadRegistros: 0,
          cantidadRegistrosMtto: 0,
        });
      }

      const item = resultadoMap.get(periodo.key);

      item.cantidadOperaciones += 1;

      for (const registro of registrosArray) {
        if (!registro.hora_inicio || !registro.hora_final) continue;

        const horas = this.calcularDuracionHoras(
          registro.hora_inicio,
          registro.hora_final,
        );

        if (!horas || horas <= 0) continue;

        const estado = String(registro.estado || '')
          .trim()
          .toUpperCase();

        // SUMA(HORAS)
        item.horasTotales += horas;
        item.cantidadRegistros += 1;

        // SUMA(HRS MANTENIMIENTO)
        if (estado === 'MANTENIMIENTO') {
          item.horasMtto += horas;
          item.cantidadRegistrosMtto += 1;
        }
      }
    });

    const resultado = Array.from(resultadoMap.values()).map((item) => {
      item.horasDisponibles = item.horasTotales - item.horasMtto;

      if (item.horasTotales > 0) {
        item.disponibilidad = Number(
          ((item.horasDisponibles / item.horasTotales) * 100).toFixed(2),
        );
      } else {
        item.disponibilidad = 0;
      }

      item.horasTotales = Number(item.horasTotales.toFixed(2));
      item.horasMtto = Number(item.horasMtto.toFixed(2));
      item.horasDisponibles = Number(item.horasDisponibles.toFixed(2));

      return item;
    });

    resultado.sort((a, b) => String(a.key).localeCompare(String(b.key)));

    return resultado;
  }


DisponibilidadPorSeccion() {
  const resultadoMap = new Map<string, any>();

  this.operacionesFiltradas.forEach((op) => {
    const seccion = op.seccion || 'SIN SECCION';
    const HORAS_TOTALES = 12;
    let horasMtto = 0;

    const registrosArray = op.registros;
    if (!Array.isArray(registrosArray)) return;

    for (const registro of registrosArray) {
      if (registro.estado !== 'MANTENIMIENTO') continue;

      const horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final!
      );

      horasMtto += horas;
    }

    horasMtto = Math.min(horasMtto, HORAS_TOTALES);

    if (!resultadoMap.has(seccion)) {
      resultadoMap.set(seccion, {
        seccion,
        horasTotales: 0,
        horasMtto: 0,
        disponibilidad: 0,
        cantidadPartes: 0
      });
    }

    const item = resultadoMap.get(seccion);

    item.horasTotales += HORAS_TOTALES;
    item.horasMtto += horasMtto;
    item.cantidadPartes += 1;

    try {
      const disponibilidadActual =
        ((item.horasTotales - item.horasMtto) / item.horasTotales) * 100;

      item.disponibilidad = Number(disponibilidadActual.toFixed(2));
    } catch (error) {
      item.disponibilidad = 0;
    }
  });

  const resultado = Array.from(resultadoMap.values());

   //console.log('📊 DISPONIBILIDAD POR SECCION:', resultado);

  return resultado;
}

//=========================================
//HOJA 2
//=========================================

//GRAFICO 1 - UTILIZACIÓN POR EQUIPO
UtilizacionPorEquipo() {
  const resultadoMap = new Map<string, any>();

  this.operacionesFiltradas.forEach((op) => {
    const modeloEquipo = `${op.equipo}-${op.n_equipo}`;
    const HORAS_TOTALES = 12;
    let horasMtto = 0;
    let horasOperativas = 0;

    const registrosArray = op.registros;
    if (!Array.isArray(registrosArray)) return;

    for (const registro of registrosArray) {
      const horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final!
      );

      // 🔥 Acumular horas de MANTENIMIENTO
      if (registro.estado === 'MANTENIMIENTO') {
        horasMtto += horas;
      }
      
      // 🔥 Acumular horas de OPERATIVO
      if (registro.estado === 'OPERATIVO') {
        horasOperativas += horas;
      }
    }

    // Limitar horasMtto al total disponible
    horasMtto = Math.min(horasMtto, HORAS_TOTALES);
    // Limitar horasOperativas al total disponible
    horasOperativas = Math.min(horasOperativas, HORAS_TOTALES);

    if (!resultadoMap.has(modeloEquipo)) {
      resultadoMap.set(modeloEquipo, {
        modeloEquipo,
        horasTotales: 0,
        horasMtto: 0,
        horasOperativas: 0,
        utilizacion: 0,
        cantidadPartes: 0
      });
    }

    const item = resultadoMap.get(modeloEquipo);
    item.horasTotales += HORAS_TOTALES;
    item.horasMtto += horasMtto;
    item.horasOperativas += horasOperativas;
    item.cantidadPartes += 1;

    // 🔥 Fórmula: Utilizacion = HRS OPERATIVAS / (HORAS - HRS MTTO)
    // CON SI.ERROR - usando try-catch
    try {
      const denominador = item.horasTotales - item.horasMtto;
      
      if (denominador === 0) {
        item.utilizacion = 0; // 🔥 Evitar división por cero
      } else {
        const utilizacionActual = (item.horasOperativas / denominador) * 100;
        item.utilizacion = Number(utilizacionActual.toFixed(2));
      }
    } catch (error) {
      item.utilizacion = 0; // 🔥 como el SI.ERROR
    }
  });

  const resultado = Array.from(resultadoMap.values());
  // console.log('📊 UTILIZACIÓN POR EQUIPO:', resultado);
  return resultado;
}

//GRAFICO 4 FALTA

// 🔥 Método auxiliar para obtener descripción de cada código
private obtenerDescripcionDemora(codigo: string): string {

  const descripciones: { [key: string]: string } = {

    '301': 'Abastecimiento de Combustible',
    '302': 'Charla/Reparto de guardia/Traslado de personal',
    '303': 'Despeje por Voladura',
    '304': 'Inspección de la Labor',
    '305': 'Lavado de Equipo',
    '306': 'Llenado de Check List del Equipo',
    '307': 'Refrigerio/Almuerzo',
    '308': 'Parada Planta',
    '309': 'Paro Sindical',
    '310': 'Operador No Entrega su Reporte',
    '311': 'Incidente/Accidente personal',
    '312': 'Otros'

  };

  return descripciones[codigo] || 'DEMORA DESCONOCIDA';
}

//GRAFICO 6 - UTILIZACIÓN POR DÍA
  UtilizacionPorDia() {
    return this.calcularUtilizacionBasePorDia(this.operacionesFiltradas, true);
  }

  UtilizacionPorSemana() {
    return this.calcularUtilizacionPorPeriodoVisual('SEMANA');
  }

  UtilizacionPorMes() {
    return this.calcularUtilizacionPorPeriodoVisual('MES');
  }

  private calcularUtilizacionPorPeriodoVisual(tipo: 'SEMANA' | 'MES') {
    const resultadoMap = this.crearPeriodosVisiblesUtilizacion(tipo);

    // Usa data original para que fechaInicio y fechaFin NO afecten el cálculo
    // Solo filtro por turno, si corresponde
    const dataCalculo = this.filtrarSoloPorTurno(this.operacionesOriginal);

    const datosPorDia = this.calcularUtilizacionBasePorDia(dataCalculo, false);

    datosPorDia.forEach((dia) => {
      const periodo = obtenerPeriodoDesdeKey(dia.key, tipo);

      if (!periodo) return;

      // Solo se muestran semanas/meses que están dentro del rango visual seleccionado
      if (!resultadoMap.has(periodo.key)) return;

      const item = resultadoMap.get(periodo.key);

      item.horasTotales += Number(dia.horasTotales || 0);
      item.horasMtto += Number(dia.horasMtto || 0);
      item.horasDisponibles += Number(dia.horasDisponibles || 0);
      item.horasOperativas += Number(dia.horasOperativas || 0);

      item.cantidadOperaciones += Number(dia.cantidadOperaciones || 0);
      item.cantidadRegistros += Number(dia.cantidadRegistros || 0);
      item.cantidadRegistrosOperativos += Number(
        dia.cantidadRegistrosOperativos || 0,
      );
      item.cantidadRegistrosMtto += Number(dia.cantidadRegistrosMtto || 0);

      if (dia.horasDisponibles > 0) {
        item.sumaUtilizacion += Number(dia.utilizacion || 0);
        item.cantidadDiasConDatos += 1;
      }
    });

    const resultado = Array.from(resultadoMap.values()).map((item) => {
      if (item.cantidadDiasConDatos > 0) {
        item.utilizacion = Number(
          (item.sumaUtilizacion / item.cantidadDiasConDatos).toFixed(2),
        );
      } else {
        item.utilizacion = 0;
      }

      item.sumaUtilizacion = Number(item.sumaUtilizacion.toFixed(2));
      item.horasTotales = Number(item.horasTotales.toFixed(2));
      item.horasMtto = Number(item.horasMtto.toFixed(2));
      item.horasDisponibles = Number(item.horasDisponibles.toFixed(2));
      item.horasOperativas = Number(item.horasOperativas.toFixed(2));

      return item;
    });

    resultado.sort((a, b) => a.key.localeCompare(b.key));

    return resultado;
  }
  private calcularUtilizacionBasePorDia(
    dataOperaciones: OperacionBaseScoop[],
    usarRangoFechas: boolean,
  ) {
    const resultadoMap = new Map<string, any>();

    // Solo para el gráfico por día: crear todos los días del rango seleccionado
    if (usarRangoFechas && this.fechaInicio && this.fechaFin) {
      const diasRango = generarDiasEntreFechas(this.fechaInicio, this.fechaFin);

      diasRango.forEach((dia) => {
        resultadoMap.set(dia.key, {
          key: dia.key,
          periodo: dia.label,

          horasTotales: 0,
          horasMtto: 0,
          horasDisponibles: 0,
          horasOperativas: 0,
          utilizacion: 0,

          cantidadOperaciones: 0,
          cantidadRegistros: 0,
          cantidadRegistrosOperativos: 0,
          cantidadRegistrosMtto: 0,
        });
      });
    }

    dataOperaciones.forEach((op) => {
      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      const fecha = op.fecha;

      if (!fecha) return;

      const periodo = obtenerPeriodo(fecha, 'DIA');

      if (!periodo) return;

      if (!resultadoMap.has(periodo.key)) {
        resultadoMap.set(periodo.key, {
          key: periodo.key,
          periodo: periodo.label,

          horasTotales: 0,
          horasMtto: 0,
          horasDisponibles: 0,
          horasOperativas: 0,
          utilizacion: 0,

          cantidadOperaciones: 0,
          cantidadRegistros: 0,
          cantidadRegistrosOperativos: 0,
          cantidadRegistrosMtto: 0,
        });
      }

      const item = resultadoMap.get(periodo.key);

      item.cantidadOperaciones += 1;

      for (const registro of registrosArray) {
        if (!registro.hora_inicio || !registro.hora_final) continue;

        const horas = this.calcularDuracionHoras(
          registro.hora_inicio,
          registro.hora_final,
        );

        if (!horas || horas <= 0) continue;

        const estado = String(registro.estado || '')
          .trim()
          .toUpperCase();

        const codigo = String(registro.codigo || '').trim();

        item.horasTotales += horas;
        item.cantidadRegistros += 1;

        if (estado === 'MANTENIMIENTO') {
          item.horasMtto += horas;
          item.cantidadRegistrosMtto += 1;
        }

        if (this.CODIGOS_OPERATIVOS.includes(codigo)) {
          item.horasOperativas += horas;
          item.cantidadRegistrosOperativos += 1;
        }
      }
    });

    const resultado = Array.from(resultadoMap.values()).map((item) => {
      item.horasDisponibles = item.horasTotales - item.horasMtto;

      if (item.horasDisponibles > 0) {
        item.utilizacion = Number(
          ((item.horasOperativas / item.horasDisponibles) * 100).toFixed(2),
        );
      } else {
        item.utilizacion = 0;
      }

      item.horasTotales = Number(item.horasTotales.toFixed(2));
      item.horasMtto = Number(item.horasMtto.toFixed(2));
      item.horasDisponibles = Number(item.horasDisponibles.toFixed(2));
      item.horasOperativas = Number(item.horasOperativas.toFixed(2));

      return item;
    });

    resultado.sort((a, b) => a.key.localeCompare(b.key));

    return resultado;
  }
  private crearPeriodosVisiblesUtilizacion(tipo: 'SEMANA' | 'MES') {
    const resultadoMap = new Map<string, any>();

    if (!this.fechaInicio || !this.fechaFin) {
      return resultadoMap;
    }

    const diasRango = generarDiasEntreFechas(this.fechaInicio, this.fechaFin);

    diasRango.forEach((dia) => {
      const periodo = obtenerPeriodoDesdeKey(dia.key, tipo);

      if (!periodo) return;

      if (!resultadoMap.has(periodo.key)) {
        resultadoMap.set(periodo.key, {
          key: periodo.key,
          periodo: periodo.label,
          anio: periodo.anio || null,
          fechaInicio: periodo.fechaInicio || null,
          fechaFin: periodo.fechaFin || null,

          sumaUtilizacion: 0,
          utilizacion: 0,

          // días que entran en el rango visual seleccionado
          cantidadDiasRango: 0,

          // días reales con datos usados para el promedio
          cantidadDiasConDatos: 0,

          horasTotales: 0,
          horasMtto: 0,
          horasDisponibles: 0,
          horasOperativas: 0,

          cantidadOperaciones: 0,
          cantidadRegistros: 0,
          cantidadRegistrosOperativos: 0,
          cantidadRegistrosMtto: 0,
        });
      }

      const item = resultadoMap.get(periodo.key);
      item.cantidadDiasRango += 1;
    });

    return resultadoMap;
  }
  private filtrarSoloPorTurno(data: OperacionBaseScoop[]) {
    return data.filter((op) => {
      if (this.turnoAplicado && op.turno !== this.turnoAplicado) return false;
      return true;
    });
  }

//GRAFICO - UTILIZACIÓN POR SECCIÓN (CON DETALLES)
UtilizacionPorSeccionDetallada() {
  const resultadoMap = new Map<string, any>();

  this.operacionesFiltradas.forEach((op) => {
    const seccion = op.seccion;
    if (!seccion) return;
    
    const HORAS_TOTALES = 12;
    let horasMtto = 0;
    let horasOperativas = 0;
    let totalCucharas = 0;

    const registrosArray = op.registros;
    if (!Array.isArray(registrosArray)) return;

    for (const registro of registrosArray) {
      const horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final!
      );

      if (registro.estado === 'MANTENIMIENTO') {
        horasMtto += horas;
      }
      
      if (registro.estado === 'OPERATIVO') {
        horasOperativas += horas;
        
        // 🔥 Contar cucharas operativas
        const n_cucharas = registro.operacion?.n_cucharas;
        if (n_cucharas && !isNaN(Number(n_cucharas))) {
          totalCucharas += Number(n_cucharas);
        }
      }
    }

    horasMtto = Math.min(horasMtto, HORAS_TOTALES);
    horasOperativas = Math.min(horasOperativas, HORAS_TOTALES);

    if (!resultadoMap.has(seccion)) {
      resultadoMap.set(seccion, {
        seccion: seccion,
        horasTotales: 0,
        horasMtto: 0,
        horasOperativas: 0,
        totalCucharas: 0,
        utilizacion: 0,
        cantidadOperaciones: 0,
        cantidadEquipos: new Set() // Para contar equipos únicos
      });
    }

    const item = resultadoMap.get(seccion);
    item.horasTotales += HORAS_TOTALES;
    item.horasMtto += horasMtto;
    item.horasOperativas += horasOperativas;
    item.totalCucharas += totalCucharas;
    item.cantidadOperaciones += 1;
    item.cantidadEquipos.add(`${op.equipo}-${op.n_equipo}`);

    // 🔥 Calcular utilización
    const denominador = item.horasTotales - item.horasMtto;
    if (denominador > 0) {
      item.utilizacion = Number(((item.horasOperativas / denominador) * 100).toFixed(2));
    }
  });

  // 🔥 Convertir Set a número
  const resultado = Array.from(resultadoMap.values())
    .map(item => ({
      ...item,
      cantidadEquipos: item.cantidadEquipos.size
    }))
    .sort((a, b) => a.seccion.localeCompare(b.seccion));

  //console.log('📊 UTILIZACIÓN POR SECCIÓN DETALLADA:', resultado);
  return resultado;
}

//=========================================
//HOJA 3
//|=========================================





//=========================================
//HOJA 4
//|=========================================
DisponibilidadPorOperador() {
  const resultadoMap = new Map<string, any>();

  this.operacionesFiltradas.forEach((op) => {
    const operador = op.operador || 'SIN OPERADOR';
    const HORAS_TOTALES = 12;
    let horasMtto = 0;

    const registrosArray = op.registros;
    if (!Array.isArray(registrosArray)) return;

    for (const registro of registrosArray) {
      if (registro.estado !== 'MANTENIMIENTO') continue;
      const horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final!
      );
      horasMtto += horas;
    }

    horasMtto = Math.min(horasMtto, HORAS_TOTALES);

    if (!resultadoMap.has(operador)) {
      resultadoMap.set(operador, {
        operador,
        horasTotales: 0,
        horasMtto: 0,
        disponibilidad: 0,
        cantidadOperaciones: 0
      });
    }

    const item = resultadoMap.get(operador);
    item.horasTotales += HORAS_TOTALES;
    item.horasMtto += horasMtto;
    item.cantidadOperaciones += 1;

    try {
      const disponibilidadActual = ((item.horasTotales - item.horasMtto) / item.horasTotales) * 100;
      item.disponibilidad = Number(disponibilidadActual.toFixed(2));
    } catch (error) {
      item.disponibilidad = 0;
    }
  });

  const resultado = Array.from(resultadoMap.values())
    .sort((a, b) => b.disponibilidad - a.disponibilidad); // Ordenar por mejor disponibilidad

  //console.log('📊 DISPONIBILIDAD POR OPERADOR:', resultado);
  return resultado;
}

//=========================================
//HOJA 6
//|=========================================

//GRAFICO - HORAS POR OBSERVACIÓN
HorasPorObservacion() {
  const resultadoMap = new Map<string, any>();

  // 🔥 Códigos de actividad permitidos (opcional, puedes quitarlos si quieres todas)
  const codigosPermitidos = [
  '301',
  '302',
  '303',
  '304',
  '305',
  '306',
  '307',
  '308',
  '309',
  '310',
  '311',
  '312'
];
  
  // 🔥 Estados que quieres considerar (puedes ajustar según necesites)
  const estadosPermitidos = ['DEMORA'];

  this.operacionesFiltradas.forEach((op) => {
    const HORAS_TOTALES = 12;
    
    const registrosArray = op.registros;
    if (!Array.isArray(registrosArray)) return;

    for (const registro of registrosArray) {
      
      // 🔥 Filtrar por estado si es necesario
      const estado = registro.estado || '';
      if (!estadosPermitidos.includes(estado)) continue;
      
      // 🔥 Filtrar por código si es necesario
      const codigo = registro.codigo || '';
      if (!codigosPermitidos.includes(codigo)) continue;
      
      // 🔥 Obtener la observación de la operación
      const observacion = registro.operacion?.observaciones || 'SIN OBSERVACIÓN';
      
      // 🔥 Si la observación está vacía o es solo espacios, la tratamos como "SIN OBSERVACIÓN"
      const observacionTrim = observacion.trim();
      const claveObservacion = observacionTrim === '' ? 'SIN OBSERVACIÓN' : observacionTrim;
      
      // 🔥 Calcular horas
      let horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final!
      );
      
      // 🔥 Limitar horas al total disponible (máximo 12 por operación)
      horas = Math.min(horas, HORAS_TOTALES);
      
      // 🔥 Crear o actualizar item en el mapa
      if (!resultadoMap.has(claveObservacion)) {
        resultadoMap.set(claveObservacion, {
          observacion: claveObservacion,
          horasTotales: 0,
          cantidadRegistros: 0,
          cantidadOperaciones: 0,
          // 🔥 Para tracking adicional
          codigosRelacionados: new Set(),
          estadosRelacionados: new Set()
        });
      }
      
      const item = resultadoMap.get(claveObservacion);
      item.horasTotales += horas;
      item.cantidadRegistros += 1;
      item.codigosRelacionados.add(codigo);
      item.estadosRelacionados.add(estado);
    }
  });
  
  // 🔥 Agregar operaciones únicas al final (contar operaciones distintas)
  // Esto se hace después de procesar todos los registros
  const resultado = Array.from(resultadoMap.values())
    .map(item => ({
      ...item,
      cantidadOperaciones: item.cantidadRegistros, // o podrías calcular operaciones únicas
      codigosRelacionados: Array.from(item.codigosRelacionados),
      estadosRelacionados: Array.from(item.estadosRelacionados)
    }))
    .sort((a, b) => b.horasTotales - a.horasTotales)
    .map(item => ({
      ...item,
      horasTotales: Number(item.horasTotales.toFixed(2))
    }));
  
  //console.log('📊 HORAS POR OBSERVACIÓN:', resultado);
  return resultado;
}
DisponibilidadPorGuardia() {
  const resultadoMap = new Map<string, any>();

  this.operacionesFiltradas.forEach((op) => {
    const guardia = op.seccion || 'SIN GUARDIA';
    const key = guardia;

    const registrosArray = op.registros;

    if (!Array.isArray(registrosArray)) return;

    let horasTotalesOperacion = 0;
    let horasMttoOperacion = 0;

    for (const registro of registrosArray) {
      if (!registro.hora_inicio || !registro.hora_final) continue;

      const horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final
      );

      if (!horas || horas <= 0) continue;

      // Suma todas las horas del registro
      horasTotalesOperacion += horas;

      // Solo suma como mantenimiento si el estado es MANTENIMIENTO
      if ((registro.estado || '').trim().toUpperCase() === 'MANTENIMIENTO') {
        horasMttoOperacion += horas;
      }
    }

    if (!resultadoMap.has(key)) {
      resultadoMap.set(key, {
        guardia: key,
        horasTotales: 0,
        horasMtto: 0,
        horasOperativas: 0,
        disponibilidad: 0,
        cantidadOperaciones: 0
      });
    }

    const item = resultadoMap.get(key);

    item.horasTotales += horasTotalesOperacion;
    item.horasMtto += horasMttoOperacion;
    item.horasOperativas = item.horasTotales - item.horasMtto;
    item.cantidadOperaciones += 1;
  });

  const resultado = Array.from(resultadoMap.values()).map((item) => {
    if (item.horasTotales > 0) {
      const disponibilidad =
        ((item.horasTotales - item.horasMtto) / item.horasTotales) * 100;

      item.disponibilidad = Number(disponibilidad.toFixed(2));
      item.horasTotales = Number(item.horasTotales.toFixed(2));
      item.horasMtto = Number(item.horasMtto.toFixed(2));
      item.horasOperativas = Number(item.horasOperativas.toFixed(2));
    } else {
      item.disponibilidad = 0;
    }

    return item;
  });

  resultado.sort((a, b) => b.disponibilidad - a.disponibilidad);

  //console.log('📊 DISPONIBILIDAD POR GUARDIA:', resultado);

  return resultado;
}


UtilizacionGuardia() {
  const resultadoMap = new Map<string, any>();

  const CODIGOS_OPERATIVOS = ['101', '102', '105', '106', '108'];

  this.operacionesFiltradas.forEach((op) => {
    const guardia = op.seccion || 'SIN GUARDIA';

    const key = guardia;

    const registrosArray = op.registros;

    if (!Array.isArray(registrosArray)) return;

    if (!resultadoMap.has(key)) {
      resultadoMap.set(key, {
        guardia,
        horasTotales: 0,
        horasMtto: 0,
        horasDisponibles: 0,
        horasOperativas: 0,
        utilizacion: 0,
        cantidadOperaciones: 0,
        cantidadRegistrosOperativos: 0,
        cantidadRegistrosMtto: 0
      });
    }

    const item = resultadoMap.get(key);

    item.cantidadOperaciones += 1;

    for (const registro of registrosArray) {
      if (!registro.hora_inicio || !registro.hora_final) continue;

      const horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final
      );

      if (!horas || horas <= 0) continue;

      const estado = String(registro.estado || '')
        .trim()
        .toUpperCase();

      const codigo = String(registro.codigo || '')
        .trim();

      // SUMA(HORAS): todas las horas de todos los registros
      item.horasTotales += horas;

      // SUMA(HRS MANTENIMIENTO)
      if (estado === 'MANTENIMIENTO') {
        item.horasMtto += horas;
        item.cantidadRegistrosMtto += 1;
      }

      // SUMA(HRS OPERATIVAS): solo códigos productivos
      if (CODIGOS_OPERATIVOS.includes(codigo)) {
        item.horasOperativas += horas;
        item.cantidadRegistrosOperativos += 1;
      }
    }
  });

  const resultado = Array.from(resultadoMap.values()).map((item) => {
    item.horasDisponibles = item.horasTotales - item.horasMtto;

    if (item.horasDisponibles > 0) {
      const utilizacion =
        (item.horasOperativas / item.horasDisponibles) * 100;

      item.utilizacion = Number(utilizacion.toFixed(2));
    } else {
      item.utilizacion = 0;
    }

    item.horasTotales = Number(item.horasTotales.toFixed(2));
    item.horasMtto = Number(item.horasMtto.toFixed(2));
    item.horasDisponibles = Number(item.horasDisponibles.toFixed(2));
    item.horasOperativas = Number(item.horasOperativas.toFixed(2));

    return item;
  });

  resultado.sort((a, b) => b.utilizacion - a.utilizacion);

  //console.log('📊 UTILIZACIÓN POR GUARDIA:', resultado);

  return resultado;
}

//=========================================
//HOJA 7
//|=========================================

//GRAFICO - HORAS DE DEMORA POR CÓDIGO (OPERATIVAS Y NO OPERATIVAS)
HorasDemoraPorCodigoCompleto() {
  const resultadoMap = new Map<string, any>();

  // 🔥 Códigos de demora NO OPERATIVAS
  const codigosDemoraNoOperativa = [
    '301', '302', '303', '304', '305', '306',
    '307', '308', '309', '310', '311', '312'
  ];
  
  // 🔥 Códigos de demora OPERATIVAS (problemas con equipos)
  const codigosDemoraOperativa = [
  '401', '402', '403', '404', '405', '406',
  '407', '408', '409', '410', '411', '412'
];
  // 🔥 Unir todos los códigos de demora
  const todosCodigosDemora = [...codigosDemoraNoOperativa, ...codigosDemoraOperativa];
  
  // 🔥 Estados que quieres considerar
  const estadosPermitidos = ['DEMORA'];

  this.operacionesFiltradas.forEach((op) => {
    const HORAS_TOTALES = 12;
    
    const registrosArray = op.registros;
    if (!Array.isArray(registrosArray)) return;

    for (const registro of registrosArray) {
      
      // 🔥 Filtrar por estado
      const estado = registro.estado || '';
      if (!estadosPermitidos.includes(estado)) continue;
      
      // 🔥 Filtrar por código de demora
      const codigo = registro.codigo || '';
      if (!todosCodigosDemora.includes(codigo)) continue;
      
      // 🔥 Determinar tipo de demora
      const tipoDemora = codigosDemoraNoOperativa.includes(codigo) 
        ? 'NO OPERATIVA' 
        : 'OPERATIVA';
      
      // 🔥 Calcular horas
      let horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final!
      );
      
      horas = Math.min(horas, HORAS_TOTALES);
      
      if (!resultadoMap.has(codigo)) {
        resultadoMap.set(codigo, {
          codigo: codigo,
          tipoDemora: tipoDemora,
          horasDemora: 0,
          cantidadRegistros: 0,
          descripcion: this.obtenerDescripcionCompleta(codigo, tipoDemora),
          equiposRelacionados: new Set()
        });
      }
      
      const item = resultadoMap.get(codigo);
      item.horasDemora += horas;
      item.cantidadRegistros += 1;
      item.equiposRelacionados.add(`${op.equipo}-${op.n_equipo}`);
    }
  });
  
  const resultado = Array.from(resultadoMap.values())
    .map(item => ({
      ...item,
      equiposRelacionados: Array.from(item.equiposRelacionados)
    }))
    .sort((a, b) => b.horasDemora - a.horasDemora)
    .map(item => ({
      ...item,
      horasDemora: Number(item.horasDemora.toFixed(2))
    }));
  
  //console.log('📊 HORAS DE DEMORA POR CÓDIGO COMPLETO:', resultado);
  return resultado;
}

private obtenerDescripcionCompleta(codigo: string, tipoDemora: string): string {
  const descripciones: { [key: string]: string } = {
    // OPERATIVAS (equipo)
    '401': 'ESPERA DE ORDEN DE TRABAJO/EVALUACIÓN GEOMECÁNICA',
    '402': 'ESPERA POR CONDICIÓN DE LABOR',
    '403': 'ESPERA DE VOLQUETE',
    '404': 'ESPERA TRASLADO DE PERSONAL',
    '405': 'FALTA DE COMBUSTIBLE',
    '406': 'FALTA DE ILUMINACIÓN',
    '407': 'FALTA DE OPERADOR',
    '408': 'FALTA DE VENTILACIÓN',
    '409': 'OBSTRUCCIÓN DE VÍAS-MATERIAL/EQUIPO',
    '410': 'STAND BY',
    '411': 'OTROS',
    '412': 'SIN ÁREA DE TRABAJO',
    
    // NO OPERATIVAS (externas)
    '301': 'ABASTECIMIENTO DE COMBUSTIBLE',
    '302': 'CHARLA/REPARTO DE GUARDIA/TRASLADO DE PERSONAL',
    '303': 'DESPEJE POR VOLADURA',
    '304': 'INSPECCIÓN DE LA LABOR',
    '305': 'LAVADO DE EQUIPO',
    '306': 'LLENADO DE CHECK LIST DEL EQUIPO',
    '307': 'REFRIGERIO/ALMUERZO',
    '308': 'PARADA PLANTA',
    '309': 'PARO SINDICAL',
    '310': 'OPERADOR NO ENTREGA SU REPORTE',
    '311': 'INCIDENTE/ACCIDENTE PERSONAL',
    '312': 'OTROS'
  };
  
  return descripciones[codigo] || `CÓDIGO ${codigo} - ${tipoDemora}`;
}


//=========================================
//HOJA 8
//|=========================================

//GRAFICO - MTBF POR EQUIPO (Mean Time Between Failures)
  MTTRPorEquipo() {
    const resultadoMap = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const equipo = op.equipo || 'SIN EQUIPO';
      const nEquipo = op.n_equipo || 'SIN N° EQUIPO';
      const modeloEquipo = op.modelo_equipo || nEquipo;

      const key = modeloEquipo;

      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      if (!resultadoMap.has(key)) {
        resultadoMap.set(key, {
          equipo,
          n_equipo: nEquipo,
          modelo_equipo: modeloEquipo,

          horasMttoCorrectivo: 0,
          fallas: 0,
          mttr: 0,

          cantidadOperaciones: 0,
          cantidadRegistros: 0,
          cantidadRegistrosMttoCorrectivo: 0,
        });
      }

      const item = resultadoMap.get(key);

      item.cantidadOperaciones += 1;

      for (const registro of registrosArray) {
        const codigo = String(registro.codigo || '').trim();
        const estado = String(registro.estado || '')
          .trim()
          .toUpperCase();

        if (!registro.hora_inicio || !registro.hora_final) continue;

        const horas = this.calcularDuracionHoras(
          registro.hora_inicio,
          registro.hora_final,
        );

        if (!horas || horas <= 0) continue;

        item.cantidadRegistros += 1;

        if (this.esMantenimientoCorrectivo(codigo)) {
          item.horasMttoCorrectivo += horas;

          // Cada registro de mantenimiento correctivo cuenta como una falla
          item.fallas += 1;

          item.cantidadRegistrosMttoCorrectivo += 1;
        }
      }
    });

    const resultado = Array.from(resultadoMap.values()).map((item) => {
      if (item.fallas > 0) {
        item.mttr = Number((item.horasMttoCorrectivo / item.fallas).toFixed(2));
      } else {
        item.mttr = 0;
      }

      item.horasMttoCorrectivo = Number(item.horasMttoCorrectivo.toFixed(2));

      return item;
    });

    resultado.sort((a, b) => b.mttr - a.mttr);

    return resultado;
  }
  MTBFPorEquipo() {
    const resultadoMap = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const equipo = op.equipo || 'SIN EQUIPO';
      const nEquipo = op.n_equipo || 'SIN N° EQUIPO';
      const modeloEquipo = op.modelo_equipo || nEquipo;

      const key = modeloEquipo;

      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      if (!resultadoMap.has(key)) {
        resultadoMap.set(key, {
          equipo,
          n_equipo: nEquipo,
          modelo_equipo: modeloEquipo,

          horasTotales: 0,
          horasMttoCorrectivo: 0,
          horasSinMttoCorrectivo: 0,

          fallas: 0,
          mtbf: 0,

          cantidadOperaciones: 0,
          cantidadRegistros: 0,
          cantidadRegistrosMttoCorrectivo: 0,
        });
      }

      const item = resultadoMap.get(key);

      item.cantidadOperaciones += 1;

      for (const registro of registrosArray) {
        const codigo = String(registro.codigo || '').trim();
        const estado = String(registro.estado || '')
          .trim()
          .toUpperCase();

        if (!registro.hora_inicio || !registro.hora_final) continue;

        const horas = this.calcularDuracionHoras(
          registro.hora_inicio,
          registro.hora_final,
        );

        if (!horas || horas <= 0) continue;

        // SUMA(BD_JUMBOS[HORAS])
        item.horasTotales += horas;
        item.cantidadRegistros += 1;

        // SUMA(BD_JUMBOS[Hrs. Mtto. Correctivo])
        if (this.esMantenimientoCorrectivo(codigo)) {
          item.horasMttoCorrectivo += horas;

          // SUMA(BD_JUMBOS[#FALLAS])
          item.fallas += 1;

          item.cantidadRegistrosMttoCorrectivo += 1;
        }
      }
    });

    const resultado = Array.from(resultadoMap.values()).map((item) => {
      item.horasSinMttoCorrectivo =
        item.horasTotales - item.horasMttoCorrectivo;

      const divisorFallas = item.fallas === 0 ? 1 : item.fallas;

      item.mtbf = Number(
        (item.horasSinMttoCorrectivo / divisorFallas).toFixed(2),
      );

      item.horasTotales = Number(item.horasTotales.toFixed(2));
      item.horasMttoCorrectivo = Number(item.horasMttoCorrectivo.toFixed(2));
      item.horasSinMttoCorrectivo = Number(
        item.horasSinMttoCorrectivo.toFixed(2),
      );

      return item;
    });

    resultado.sort((a, b) => b.mtbf - a.mtbf);

    return resultado;
  }

  MTBFPorSemana() {
    return this.calcularMTTRMTBFPorPeriodoVisual('SEMANA');
  }

  MTBFPorMes() {
    return this.calcularMTTRMTBFPorPeriodoVisual('MES');
  }

  MTBFPorAño() {
    return this.calcularMTTRMTBFPorPeriodoVisual('ANIO');
  }

  MTTRPorSemana() {
    return this.calcularMTTRMTBFPorPeriodoVisual('SEMANA');
  }

  MTTRPorMes() {
    return this.calcularMTTRMTBFPorPeriodoVisual('MES');
  }

  MTTRPorAño() {
    return this.calcularMTTRMTBFPorPeriodoVisual('ANIO');
  }



  private calcularMTTRMTBFPorPeriodoVisual(
  tipo: 'SEMANA' | 'MES' | 'ANIO'
) {
  const resultadoMap = this.crearPeriodosVisiblesMTTRMTBF(tipo);

  const dataCalculo = this.operacionesOriginal;

  dataCalculo.forEach((op) => {
    const registrosArray = op.registros;

    if (!Array.isArray(registrosArray)) return;

    const fecha = op.fecha;

    if (!fecha) return;

    const periodo = this.obtenerPeriodoMTBFMTTR(fecha, tipo);

    if (!periodo) return;

    /**
     * Clave:
     * Si el mes/año no está dentro del rango visual seleccionado,
     * no se muestra.
     * Pero si está, el cálculo usa TODA la data original de ese mes/año.
     */
    if (!resultadoMap.has(periodo.key)) return;

    const item = resultadoMap.get(periodo.key);

    for (const registro of registrosArray) {
      const codigo = String(registro.codigo || '').trim();

      if (!registro.hora_inicio || !registro.hora_final) continue;

      const horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final
      );

      if (!horas || horas <= 0) continue;

      item.horasTotales += horas;
      item.cantidadRegistros += 1;

      if (this.esMantenimientoCorrectivo(codigo)) {
        item.horasMttoCorrectivo += horas;
        item.fallas += 1;
        item.cantidadRegistrosMttoCorrectivo += 1;
      }
    }
  });

  const resultado = Array.from(resultadoMap.values()).map((item) => {
    item.horasSinMttoCorrectivo =
      item.horasTotales - item.horasMttoCorrectivo;

    if (item.fallas > 0) {
      item.mttr = Number(
        (item.horasMttoCorrectivo / item.fallas).toFixed(2)
      );
    } else {
      item.mttr = 0;
    }

    const divisorFallas = item.fallas === 0 ? 1 : item.fallas;

    item.mtbf = Number(
      (item.horasSinMttoCorrectivo / divisorFallas).toFixed(2)
    );

    item.horasTotales = Number(item.horasTotales.toFixed(2));
    item.horasMttoCorrectivo = Number(item.horasMttoCorrectivo.toFixed(2));
    item.horasSinMttoCorrectivo = Number(
      item.horasSinMttoCorrectivo.toFixed(2)
    );

    return item;
  });

  resultado.sort((a, b) => String(a.key).localeCompare(String(b.key)));

  return resultado;
  }

  private crearPeriodosVisiblesMTTRMTBF(
    tipo: 'SEMANA' | 'MES' | 'ANIO'
  ) {
  const resultadoMap = new Map<string, any>();

  if (!this.fechaInicio || !this.fechaFin) {
    return resultadoMap;
  }

  const diasRango = generarDiasEntreFechas(this.fechaInicio, this.fechaFin);

  diasRango.forEach((dia) => {
    const periodo = this.obtenerPeriodoMTBFMTTR(dia.key, tipo);

    if (!periodo) return;

    if (!resultadoMap.has(periodo.key)) {
      resultadoMap.set(periodo.key, {
        key: periodo.key,
        periodo: periodo.label,
        anio: periodo.anio || null,
        fechaInicio: periodo.fechaInicio || null,
        fechaFin: periodo.fechaFin || null,

        horasTotales: 0,
        horasMttoCorrectivo: 0,
        horasSinMttoCorrectivo: 0,

        fallas: 0,
        mttr: 0,
        mtbf: 0,

        cantidadDiasRango: 0,
        cantidadRegistros: 0,
        cantidadRegistrosMttoCorrectivo: 0,
      });
    }

    const item = resultadoMap.get(periodo.key);
    item.cantidadDiasRango += 1;
  });

  return resultadoMap;
  }

  private obtenerPeriodoMTBFMTTR(
      fecha: string,
      tipo: 'DIA' | 'SEMANA' | 'MES' | 'ANIO',
    ) {
      if (tipo === 'DIA') {
        return obtenerPeriodo(fecha, 'DIA');
      }
  
      if (tipo === 'SEMANA') {
        return obtenerPeriodoDesdeKey(fecha, 'SEMANA');
      }
  
      if (tipo === 'MES') {
        return obtenerPeriodoDesdeKey(fecha, 'MES');
      }
  
      if (tipo === 'ANIO') {
        const date = parseFechaSimple(fecha);
  
        if (!date) return null;
  
        const anio = date.getFullYear();
  
        return {
          key: `${anio}`,
          label: `${anio}`,
          anio,
        };
      }
  
      return null;
    }
  
  private esMantenimientoCorrectivo(codigo: string): boolean {
    return String(codigo || '').trim() === '202';
  }

  ParetoUtilizacion() {
    const resultadoMap = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        const codigo = String(registro.codigo || '').trim();

        if (!codigo) continue;

        // Solo DEMORAS OPERATIVAS y DEMORAS NO OPERATIVAS
        if (!this.esDemoraPorCodigo(codigo)) continue;

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

    ParetoDisponibilidad() {
    const resultadoMap = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        const codigo = String(registro.codigo || '').trim();

        if (!codigo) continue;

        /**
         * Solo considerar registros que afectan DISPONIBILIDAD.
         * Normalmente son registros de MANTENIMIENTO.
         */
        const estadoRegistro = this.normalizarTexto(registro.estado);

        const esMantenimiento =
          estadoRegistro.includes('MANTENIMIENTO') ||
          this.esMantenimientoPorCodigo(codigo);

        if (!esMantenimiento) continue;

        if (!registro.hora_inicio || !registro.hora_final) continue;

        const horas = this.calcularDuracionHoras(
          registro.hora_inicio,
          registro.hora_final,
        );

        if (!horas || horas <= 0) continue;

        const observacion = String(
          registro.operacion?.observaciones || 'SIN OBSERVACIÓN',
        )
          .trim()
          .toUpperCase();

        const key = observacion || 'SIN OBSERVACIÓN';

        if (!resultadoMap.has(key)) {
          resultadoMap.set(key, {
            observacion: key,
            horasGeneral: 0,
            paretoDispObs: 0,
            porcentajeHoras: 0,
            totalHorasGeneral: 0,
            cantidadRegistros: 0,
            codigos: new Set<string>(),
          });
        }

        const item = resultadoMap.get(key);

        item.horasGeneral += horas;
        item.cantidadRegistros += 1;
        item.codigos.add(codigo);
      }
    });

    let resultado = Array.from(resultadoMap.values()).map((item) => {
      item.horasGeneral = Number(item.horasGeneral.toFixed(2));
      item.codigos = Array.from(item.codigos);

      return item;
    });

    /**
     * Mismo criterio que tu DAX:
     * [Horas General] > curHoras
     * o empate por observación alfabética.
     */
    resultado.sort((a, b) => {
      if (b.horasGeneral !== a.horasGeneral) {
        return b.horasGeneral - a.horasGeneral;
      }

      return String(a.observacion).localeCompare(String(b.observacion));
    });

    const totalHorasGeneral = resultado.reduce(
      (sum, item) => sum + Number(item.horasGeneral || 0),
      0,
    );

    let acumulado = 0;

    resultado = resultado.map((item) => {
      acumulado += Number(item.horasGeneral || 0);

      item.paretoDispObs =
        totalHorasGeneral > 0
          ? Number(((acumulado / totalHorasGeneral) * 100).toFixed(2))
          : 0;

      item.porcentajeHoras =
        totalHorasGeneral > 0
          ? Number(((item.horasGeneral / totalHorasGeneral) * 100).toFixed(2))
          : 0;

      item.totalHorasGeneral = Number(totalHorasGeneral.toFixed(2));

      return item;
    });

    return resultado;
  }

  private esDemoraPorCodigo(codigo: string): boolean {
    const estado = this.mapaEstados.get(codigo);

    if (!estado) return false;

    const categoria = this.normalizarTexto(estado.categoria);
    const estadoPrincipal = this.normalizarTexto(estado.estado_principal);

    return categoria.includes('DEMORA') || estadoPrincipal.includes('DEMORA');
  }

  private esMantenimientoPorCodigo(codigo: string): boolean {
    const estado = this.mapaEstados.get(codigo);

    if (!estado) return false;

    const estadoPrincipal = this.normalizarTexto(estado.estado_principal);
    const categoria = this.normalizarTexto(estado.categoria);

    return (
      estadoPrincipal.includes('MANTENIMIENTO') ||
      categoria.includes('MANTENIMIENTO')
    );
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

  private normalizarTexto(valor: any): string {
    return String(valor || '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

private readonly CODIGOS_OPERATIVOS = ['101', '102', '105', '106', '108'];

HorasOperativasPorDia() {
  return this.calcularHorasOperativasPorPeriodo('DIA');
}

HorasOperativasPorSemana() {
  return this.calcularHorasOperativasPorPeriodo('SEMANA');
}

HorasOperativasPorMes() {
  return this.calcularHorasOperativasPorPeriodo('MES');
}

private calcularHorasOperativasPorPeriodo(tipo: 'DIA' | 'SEMANA' | 'MES') {
  const datosPorDia = this.calcularHorasOperativasBasePorDia();

  if (tipo === 'DIA') {
    return datosPorDia;
  }

  const resultadoMap = new Map<string, any>();

  datosPorDia.forEach((dia) => {
    const periodo = obtenerPeriodoDesdeKey(dia.key, tipo);

    if (!periodo) return;

    if (!resultadoMap.has(periodo.key)) {
      resultadoMap.set(periodo.key, {
        key: periodo.key,
        periodo: periodo.label,
        fechaInicio: periodo.fechaInicio || null,
        fechaFin: periodo.fechaFin || null,
        sumaHorasOperativas: 0,
        horasOperativas: 0,
        cantidadDias: 0,
        cantidadOperaciones: 0,
        cantidadRegistrosOperativos: 0
      });
    }

    const item = resultadoMap.get(periodo.key);

    item.sumaHorasOperativas += Number(dia.horasOperativas || 0);
    item.cantidadDias += 1;
    item.cantidadOperaciones += Number(dia.cantidadOperaciones || 0);
    item.cantidadRegistrosOperativos += Number(dia.cantidadRegistrosOperativos || 0);
  });

  const resultado = Array.from(resultadoMap.values()).map((item) => {
    item.horasOperativas = item.cantidadDias > 0
      ? Number((item.sumaHorasOperativas / item.cantidadDias).toFixed(2))
      : 0;

    item.sumaHorasOperativas = Number(item.sumaHorasOperativas.toFixed(2));

    return item;
  });

  resultado.sort((a, b) => a.key.localeCompare(b.key));

  return resultado;
}

private calcularHorasOperativasBasePorDia() {
  const resultadoMap = new Map<string, any>();

  // Crear todos los días del rango con 0
  if (this.fechaInicio && this.fechaFin) {
    const diasRango = generarDiasEntreFechas(this.fechaInicio, this.fechaFin);

    diasRango.forEach((dia) => {
      resultadoMap.set(dia.key, {
        key: dia.key,
        periodo: dia.label,

        // suma total de horas operativas del día
        sumaHorasOperativas: 0,

        // promedio final que se mostrará en el gráfico
        horasOperativas: 0,

        cantidadOperaciones: 0,
        cantidadRegistrosOperativos: 0
      });
    });
  }

  this.operacionesFiltradas.forEach((op) => {
    const registrosArray = op.registros;

    if (!Array.isArray(registrosArray)) return;

    const fecha = op.fecha;

    if (!fecha) return;

    const periodo = obtenerPeriodo(fecha, 'DIA');

    if (!periodo) return;

    if (!resultadoMap.has(periodo.key)) {
      resultadoMap.set(periodo.key, {
        key: periodo.key,
        periodo: periodo.label,
        sumaHorasOperativas: 0,
        horasOperativas: 0,
        cantidadOperaciones: 0,
        cantidadRegistrosOperativos: 0
      });
    }

    const item = resultadoMap.get(periodo.key);

    let horasOperativasOperacion = 0;
    let tieneHorasOperativas = false;

    for (const registro of registrosArray) {
      const codigo = String(registro.codigo || '').trim();

      if (!this.CODIGOS_OPERATIVOS.includes(codigo)) continue;

      const horas = this.calcularDuracionHoras(
        registro.hora_inicio,
        registro.hora_final!
      );

      if (!horas || horas <= 0) continue;

      horasOperativasOperacion += horas;
      item.cantidadRegistrosOperativos += 1;
      tieneHorasOperativas = true;
    }

    // Solo cuenta la operación si tuvo horas operativas reales
    if (tieneHorasOperativas) {
      item.sumaHorasOperativas += horasOperativasOperacion;
      item.cantidadOperaciones += 1;
    }
  });

  const resultado = Array.from(resultadoMap.values()).map((item) => {
    if (item.cantidadOperaciones > 0) {
      item.horasOperativas = Number(
        (item.sumaHorasOperativas / item.cantidadOperaciones).toFixed(2)
      );
    } else {
      item.horasOperativas = 0;
    }

    item.sumaHorasOperativas = Number(item.sumaHorasOperativas.toFixed(2));

    return item;
  });

  resultado.sort((a, b) => a.key.localeCompare(b.key));

  return resultado;
}

}
