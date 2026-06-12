import { Component, OnInit } from '@angular/core';
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
import { ResumenComponent } from '../Graficos components/Hoja 1/resumen/resumen.component';
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
import { AvanceFaseComponent } from '../Graficos components/Hoja 1/avance-fase/avance-fase.component';
import { DisparosDiaComponent } from '../Graficos components/Hoja 1/disparos-dia/disparos-dia.component';
import { DetallePerforacionComponent } from '../Graficos components/Hoja 2/detalle-perforacion/detalle-perforacion.component';
import { DisparosTipoPerforacionComponent } from '../Graficos components/Hoja 2/disparos-tipo-perforacion/disparos-tipo-perforacion.component';
import { DetalleDisparosComponent } from '../Graficos components/Hoja 2/detalle-disparos/detalle-disparos.component';
import {
  MejoresOperadoresComponent,
  MejoresOperadorItem,
} from '../../../../../features/dashboard/components/mejores-operadores/mejores-operadores.component';
import {
  RankingOperadorComponent,
  RankingOperadorItem,
} from '../../../../../features/dashboard/components/ranking-operador/ranking-operador.component';
import { ObservacionesComponent } from '../Graficos components/Hoja 2/observaciones/observaciones.component';
import {
  RendimientoEquipoChartComponent,
  RendimientoEquipoChartItem,
} from '../../../../../features/dashboard/components/rendimiento-equipo-chart/rendimiento-equipo-chart.component';
import { PlanProduccionService } from '../../../../../services/plan-produccion.service';
import { PlanProduccion } from '../../../../../models/plan_produccion.model';
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
    AvanceFaseComponent,
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
    DisparosDiaComponent,
    DetallePerforacionComponent,
    DetalleDisparosComponent,
  ],
  templateUrl: './principal-grafico-largo.component.html',
  styleUrl: './principal-grafico-largo.component.css',
})
export class PrincipalGraficoLargoComponent implements OnInit {
  private readonly tiposDisparoTalLargo = new Set(['PRODUCCION', 'SLOT']);

  ESTADOS_OPERATIVOS = ['101', '102','111','112','120']
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
  dataAvanceFase: any[] = [];
  dataDisparosEquipo: any[] = []; // 👈 NUEVO
  dataDisparosDia: any[] = [];
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
  dataPercusionConMetrosJumbos: any[] = [];
  dataFrPorOperadorTurno: RankingOperadorItem[] = [];
  dataLaborFRDetallado: any[] = [];
  dataTipoPerforacion: any[] = [];
  datadetalleDisparos: any[] = [];
  dataHorasNumericas: MapaDeCalorItem[] = [];
  dataParetoHorasOperativas: ParetoChartItem[] = [];
  dataParetoHorasNoOperativas: ParetoChartItem[] = [];
  dataParetoHorasMantenimiento: ParetoChartItem[] = [];

  // Variables para el filtro de fechas
  turnoSeleccionado: string = '';
  turnoAplicado: string = '';
  resumen = {
    conteoEquipos: 0,
    metrosPorDisparo: 0,
    nDisparosTL: 0,
    totalMetros: 0,
  };

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
    this.procesarResumen();
    this.construirGanttDataNuevo();

    //console.log('🔥 DATA DISPAROS EQUIPO:', this.dataDisparosEquipo);
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
        const key = op.modelo_equipo || 'SIN_EQUIPO';

        if (mapaDisparos.has(key)) {
          const existing = mapaDisparos.get(key)!;
          existing.totalDisparos += totalDisparos;
          existing.segmentos = this.acumularSegmentos(
            existing.segmentos,
            conteoTipos,
          );
        } else {
          mapaDisparos.set(key, {
            modeloEquipo: op.modelo_equipo || 'SIN_EQUIPO',
            seccion: op.seccion || 'SIN_SECCION',
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

        const key = op.modelo_equipo || 'SIN_EQUIPO';

        if (mapa.has(key)) {
          const existing = mapa.get(key)!;
          existing.metrosPerforados += metrosPerforados;
        } else {
          mapa.set(key, {
            modeloEquipo: op.modelo_equipo || 'SIN_EQUIPO',
            seccion: op.seccion || 'SIN_SECCION',
            metrosPerforados,
          });
        }
      } catch (error) {}
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

          const duracion = this.calcularDuracionHoras(r.hora_inicio, r.hora_final);
          if (!duracion || duracion <= 0) continue;

          const estado = String(r.estado || '').trim().toUpperCase();
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

        const key = op.modelo_equipo || 'SIN_EQUIPO';

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
            seccion: op.seccion || 'SIN_SECCION',
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

  procesarDisparosDia() {
    const mapa = new Map<string, number>();

    this.operacionesFiltradas.forEach((op) => {
      try {
        const registrosArray = op.registros;

        if (Array.isArray(registrosArray) && registrosArray.length > 0) {
          // 🔥 Fecha directa de la operación
          const fecha = op.fecha || 'SIN_FECHA';

          // 🔥 Contar frentes completos (igual que antes)
          const nFrentes = this.contarFrentesCompletos(registrosArray);

          if (mapa.has(fecha)) {
            mapa.set(fecha, mapa.get(fecha)! + nFrentes);
          } else {
            mapa.set(fecha, nFrentes);
          }
        }
      } catch (error) {
        //console.error('Error procesando operación para disparos día:', op.id, error);
      }
    });

    // 🔥 Convertir a array
    return (
      Array.from(mapa.entries())
        .map(([fecha, n_frentes]) => ({
          fecha,
          n_frentes,
        }))
        // 🔥 OPCIONAL: ordenar por fecha
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
    );
  }

  procesarResumen() {
    let totalMetros = 0;
    let nDisparosTL = 0;
    const equiposSet = new Set<string>();

    this.operacionesFiltradas.forEach((op) => {
      if (op.modelo_equipo) {
        equiposSet.add(op.modelo_equipo);
      }

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

    this.resumen = {
      conteoEquipos: equiposSet.size,
      metrosPorDisparo: Number(metrosPorDisparo.toFixed(0)),
      nDisparosTL,
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

  procesarMhrEquipo(): MhrEquipoItem[] {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const key = op.modelo_equipo || 'SIN_EQUIPO';

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

  procesarLaborFR(): HoraPrimeraPerforacionItem[] {
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
  procesarTipoPerforacion() {
    const tiposValidos = new Set([
      'DESQUINCHE',
      'FRENTE COMPLETO',
      'SELLADA',
      'BREASTING',
    ]);

    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      registrosArray.forEach((r) => {
        const operacion = r?.operacion || {};

        /* const tipoPerforacion = (operacion?.tipo_perforacion || '')
          .toString()
          .trim()
          .toUpperCase(); */

        const tipoPerforacion = '';

        // 🔥 FILTRO DAX
        if (!tiposValidos.has(tipoPerforacion)) return;

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

  procesarDataPerforacionDetallada() {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const key = op.modelo_equipo || 'SIN_EQUIPO';
      const registrosArray = op.registros;

      if (!Array.isArray(registrosArray)) return;

      registrosArray.forEach((r) => {
        const operacion = r.operacion;
        if (!operacion) return;
        const tipo_perforacion = operacion.tipo_perforacion;
        if (!tipo_perforacion) return;

        const labor_fr =
          `${operacion?.tipo_labor ?? ''}${operacion?.labor ?? ''}${operacion?.ala ?? ''}`.trim();
        if (!labor_fr) return; // 🔥 también evitamos vacíos

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

    console.log('📊 GANTT DATA NUEVO:', this.ganttData);
  }
}
