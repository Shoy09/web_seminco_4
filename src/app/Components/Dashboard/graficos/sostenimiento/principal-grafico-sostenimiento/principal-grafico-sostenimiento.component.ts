import { Component, OnInit } from '@angular/core';
import {
  OperacionBase,
  OperacionBaseSostenimiento,
} from '../../../../../models/OperacionBase.models';
import { PlanProduccion } from '../../../../../models/plan_produccion.model';
import { FechasPlanMensualService } from '../../../../../services/fechas-plan-mensual.service';
import { OperacionesService } from '../../../../../services/operaciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumenComponent } from '../../../../../features/dashboard/components/resumen/resumen.component';
import {
  PernosEquipoComponent,
  PernosEquipoItem,
} from '../Graficos components/Hoja 1/pernos-equipo/pernos-equipo.component';
import {
  PernosLaborComponent,
  PernosLaborItem,
} from '../Graficos components/Hoja 1/pernos-labor/pernos-labor.component';
import {
  RendimientoEquipoChartComponent,
  RendimientoEquipoChartItem,
} from '../../../../../features/dashboard/components/rendimiento-equipo-chart/rendimiento-equipo-chart.component';
import {
  GraficaParetoChartComponent,
  ParetoChartItem,
} from '../../../../../features/dashboard/components/grafica-pareto-chart/grafica-pareto-chart.component';
import {
  PerforadoEquipoChartComponent,
  PerforadoEquipoChartItem,
} from '../../../../../features/dashboard/components/perforado-equipo-chart/perforado-equipo-chart.component';
import {
  HorometrosEquipoComponent,
  HorometroEquipoItem,
} from '../../../../../features/dashboard/components/horometros-equipo/horometros-equipo.component';
import {
  MapaDeCalorComponent,
  MapaDeCalorItem,
} from '../../../../../features/dashboard/components/mapa-de-calor/mapa-de-calor.component';
import {
  PernosInstaladosTipoComponent,
  PernosInstaladosTipoItem,
} from '../Graficos components/Hoja 1/pernos-instalados-tipo/pernos-instalados-tipo.component';
import {
  MhrEquipoComponent,
  MhrEquipoItem,
} from '../../../../../features/dashboard/components/mhr-equipo/mhr-equipo.component';
import {
  TotalHorometrosComponent,
  TotalHorometroItem,
} from '../../../../../features/dashboard/components/total-horometros/total-horometros.component';
import { PlanMensualService } from '../../../../../services/plan-mensual.service';
import { PernosMinadoTipoComponent } from '../Graficos components/Hoja 2/pernos-minado-tipo/pernos-minado-tipo.component';
import {
  HorasPrimeraPerforacionComponent,
  HoraPrimeraPerforacionItem,
} from '../../../../../features/dashboard/components/horas-primera-perforacion/horas-primera-perforacion.component';
import {
  DetalleEquipoComponent,
  DetalleEquipoItem,
} from '../Graficos components/Hoja 2/detalle-equipo/detalle-equipo.component';
import { DetalleSostenimientoComponent, DetalleSostenimientoItem } from '../Graficos components/Hoja 2/detalle-sostenimiento/detalle-sostenimiento.component';
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
  PernosDiaComponent,
  PernosDiaItem,
} from '../Graficos components/Hoja 1/pernos-dia/pernos-dia.component';
import { SchedulerComponent } from '../../Linea de tiempo/scheduler/scheduler.component';
import { EstadoService } from '../../../../../services/estado.service';
import { DashboardFiltrosComponent } from '../../../../../features/dashboard/components/dashboard-filtros/dashboard-filtros.component';
import {
  FiltrosDashboard,
  OpcionFiltroDashboard,
} from '../../../../../features/dashboard/models/dashboard-filtros.model';
import { formatearFechaYYYYMMDD } from '../../../../../utils/fecha-utils';
import { OperacionSostenimiento } from '../../../../../models/OperacionSostenimiento';

@Component({
  selector: 'app-principal-grafico-sostenimiento',
  imports: [
    CommonModule,
    FormsModule,
    ResumenComponent,
    PernosEquipoComponent,
    PernosLaborComponent,
    RendimientoEquipoChartComponent,
    PernosInstaladosTipoComponent,
    MhrEquipoComponent,
    TotalHorometrosComponent,
    GraficaParetoChartComponent,
    PerforadoEquipoChartComponent,
    HorometrosEquipoComponent,
    MapaDeCalorComponent,
    //PernosMinadoTipoComponent,
    HorasPrimeraPerforacionComponent,
    DetalleEquipoComponent,
    DetalleSostenimientoComponent,
    MejoresOperadoresComponent,
    RankingOperadorComponent,
    ObservacionesComponent,
    PernosDiaComponent,
    SchedulerComponent,
    DashboardFiltrosComponent,
  ],
  templateUrl: './principal-grafico-sostenimiento.component.html',
  styleUrl: './principal-grafico-sostenimiento.component.css',
})
export class PrincipalGraficoSostenimientoComponent implements OnInit {
  anio!: number;
  mes!: string;

  // DATA ORIGINAL (sin filtrar)
  operacionesOriginal: OperacionBaseSostenimiento[] = [];
  operacionesFiltradas: OperacionBaseSostenimiento[] = [];
  //planesMensuales: PlanProduccion[] = [];

  fechaInicio: string = '';
  fechaFin: string = '';
  turnoSeleccionado: string = '';
  tipoFiltro: 'anio' | 'mes' | 'semana' | 'rango' | 'dia' = 'dia';
  anioSeleccionado: Date | null = null;
  mesSeleccionado: Date | null = null;
  semanaSeleccionada: Date | null = null;
  diaSeleccionado: Date | null = null;
  rangoFechas: Date[] | null = null;
  turnoAplicado: string = '';
  cargandoPDF = false;
  DataPernosPorEquipo: Map<string, PernosEquipoItem> = new Map();
  DataPernoDia: PernosDiaItem[] = [];
  DataPernosPorLabor: PernosLaborItem[] = [];
  DataDMyUTI: RendimientoEquipoChartItem[] = [];
  DataEstadosSOS: ParetoChartItem[] = [];
  dataDemoraIno: ParetoChartItem[] = [];
  dataHoraMantenimiento: ParetoChartItem[] = [];
  DataPernosInstalados: PernosInstaladosTipoItem[] = [];
  DataDetalleEquipo: DetalleEquipoItem[] = [];
  DataDetalleSostenimiento: DetalleSostenimientoItem[] = [];
  dataMHREquipo: MhrEquipoItem[] = [];
  dataMetrosEquipo: PerforadoEquipoChartItem[] = [];
  dataHorometrosEquipo: HorometroEquipoItem[] = [];
  dataHorometroGeneral: TotalHorometroItem[] = [];
  dataMapaCalor: MapaDeCalorItem[] = [];

  //HOJA 2
  dataHorasNumericas: any[] = [];
  dataPernosMinadoTipo: any[] = [];
  dataProcesoLaborFR: HoraPrimeraPerforacionItem[] = [];
  dataIndicadores: DetalleEquipoItem[] = [];
  dataFrPorOperadorTurno: RankingOperadorItem[] = [];
  dataLaborFRDetallado: ObservacionItem[] = [];

  resumen: { label: string; value: number }[] = [];
  estadosProceso: any[] = [];
  ganttData: any[] = [];
  vistaPrincipal: boolean = true;
  tiposFiltro: OpcionFiltroDashboard[] = [
    { label: 'Rango', value: 'rango' },
    { label: 'Año', value: 'anio' },
    { label: 'Mes', value: 'mes' },
    { label: 'Semana', value: 'semana' },
    { label: 'Día', value: 'dia' },
  ];
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
  mapaEstados: Map<string, any> = new Map();

  constructor(
    private planMensualService: PlanMensualService,
    private fechasPlanMensualService: FechasPlanMensualService,
    private operacionesService: OperacionesService,
    private estadoService: EstadoService,
  ) {}

  ngOnInit(): void {
    this.cargarOperaciones();
    this.obtenerEstadosPorProceso('EMPERNADOR');
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
  Presentacion() {}
  generarPDF() {}

  construirMapaEstados() {
    this.mapaEstados.clear();

    this.estadosProceso.forEach((e) => {
      const codigo = String(e.codigo || '').trim();
      this.mapaEstados.set(codigo, e);
    });

    //console.log('🧩 Mapa de estados construido:', this.mapaEstados.size);
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

  cargarOperaciones() {
    const tipo = 'empernador';

    this.operacionesService
      .getAllAprobados<OperacionSostenimiento>(tipo)
      .subscribe({
        next: (resp) => {
          this.operacionesOriginal = resp.data;
        },
        error: (err) => {
          //console.error('❌ Error al obtener operaciones:', err);
        },
      });
  }

  // =========================================
  // RESUMEN
  // =========================================

  procesarResumen() {
    let totalMetros = 0;
    let totalPernos = 0;
    let laboresSet = new Set<string>();
    const equiposSet = new Set<string>();

    this.operacionesFiltradas.forEach((op) => {
      const equipo = String(op.equipo || '').trim();
      const numeroEquipo = String(op.n_equipo || '').trim();

      if (equipo && numeroEquipo) {
        equiposSet.add(`${equipo}-${numeroEquipo}`);
      }

      const registrosArray = op.registros;

      if (Array.isArray(registrosArray)) {
        for (const registro of registrosArray) {
          if (!this.esEstadoOperativoPorCodigo(registro.codigo)) continue;
          if (!registro.operacion) continue;

          const metrosRegistro = this.obtenerMetrosPerforadosRegistro(
            registro.operacion,
          );
          const pernosRegistro =
            Number(registro.operacion.n_pernos_instalados) || 0;

          totalMetros += metrosRegistro;
          totalPernos += pernosRegistro;

          const tipoLabor = registro.operacion.labor;
          if (tipoLabor) {
            laboresSet.add(tipoLabor);
          }
        }
      }
    });

    const dias =
      this.fechaFin && this.fechaInicio
        ? (new Date(this.fechaFin).getTime() -
            new Date(this.fechaInicio).getTime()) /
            (1000 * 3600 * 24) +
          1
        : 0;

    this.resumen = [
      { label: 'Equipos', value: equiposSet.size },
      { label: 'Metros Perforados', value: Number(totalMetros.toFixed(0)) },
      { label: 'Labores Sostenidas', value: laboresSet.size },
      {
        label: 'Pernos por Día',
        value: dias > 0 ? Number((totalPernos / dias).toFixed(0)) : 0,
      },
    ];
  }

  procesarTodo() {
    if (!this.operacionesFiltradas.length) return;

    this.procesarResumen();
    this.DataDMyUTI = this.procesarRendimientoEquipo();
    this.DataEstadosSOS = this.procesarParetoOperativas();
    this.dataDemoraIno = this.procesarParetoNoOperativas();
    this.dataHoraMantenimiento = this.procesarParetoMantenimiento();
    this.dataMHREquipo = this.procesarMhrEquipo();
    this.dataMetrosEquipo = this.procesarMetrosEquipo();
    this.dataHorometrosEquipo = this.procesarHorometrosEquipo();
    this.dataHorometroGeneral = this.procesarTotalHorometros();
    this.dataMapaCalor = this.procesarMapaCalor();
    this.dataProcesoLaborFR = this.procesarLaborFR();
    this.dataFrPorOperadorTurno = this.procesarFrPorOperadorTurno();
    this.dataLaborFRDetallado = this.procesarLaborFRDetallado();
    this.DataPernosPorEquipo = this.PernosPorEquipo();
    this.DataPernoDia = this.ProcesarPernoDia();
    this.DataPernosPorLabor = this.PernosPorLabor();
    this.DataPernosInstalados = this.procesarPorTipoPernoInstalado();
    this.DataDetalleEquipo = this.procesarDetalleEquipo();
    this.DataDetalleSostenimiento = this.procesarDetalleSostenimiento();
  }

  // =========================================
  // HELPERS
  // =========================================

  private obtenerEquipoKey(op: OperacionBaseSostenimiento): string {
    const eq = String(op.equipo || '').trim();
    const nEq = String(op.n_equipo || '').trim();
    return eq && nEq ? `${eq}-${nEq}` : 'SIN_EQUIPO';
  }

  private calcularDuracionHoras(horaInicio: string, horaFinal: string): number {
    if (!horaInicio || !horaFinal) return 0;
    const [h1, m1] = horaInicio.split(':').map(Number);
    const [h2, m2] = horaFinal.split(':').map(Number);
    const inicio = h1 * 60 + m1;
    const fin = h2 * 60 + m2;
    return (fin - inicio) / 60;
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

  private esEstadoNoOperativoPorCodigo(codigo: string): boolean {
    return this.ESTADOS_NO_OPERATIVOS.includes(codigo);
  }

  private esEstadoMantenimientoPorCodigo(codigo: string): boolean {
    return this.ESTADOS_MANTENIMIENTO.includes(codigo);
  }

  private obtenerMetrosPerforadosRegistro(
    operacion: OperacionSostenimiento,
  ): number {
    const long_pernos = Number(operacion.log_pernos) || 0;
    const n_pernos_instalados = Number(operacion.n_pernos_instalados) || 0;
    return long_pernos * n_pernos_instalados * 0.3048;
  }

  PernosPorEquipo(): Map<string, PernosEquipoItem> {
    const resultadoMap = new Map<string, PernosEquipoItem>();

    this.operacionesFiltradas.forEach((op) => {
      const modeloEquipo = `${op.equipo}-${op.n_equipo}`;
      const seccion = op.seccion || 'SIN_SECCION';

      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        if (!this.esEstadoOperativoPorCodigo(registro.codigo)) continue;
        const opReg = registro.operacion!;

        const tipoPernos = opReg.tipo_pernos || 'SIN_TIPO';
        const nPernos = Number(opReg.n_pernos_instalados) || 0;
        const labor = opReg.labor || 'SIN LABOR';

        if (nPernos <= 0) continue;

        const key = `${seccion}|${modeloEquipo}|${tipoPernos}|${labor}`;

        if (!resultadoMap.has(key)) {
          resultadoMap.set(key, {
            seccion,
            modeloEquipo,
            tipoPernos,
            labor,
            totalPernos: 0,
          });
        }

        resultadoMap.get(key)!.totalPernos += nPernos;
      }
    });

    return resultadoMap;
  }
  ProcesarPernoDia(): PernosDiaItem[] {
    const mapa = new Map<string, PernosDiaItem>();

    this.operacionesFiltradas.forEach((op) => {
      const fecha = op.fecha;
      const turno = op.turno || 'SIN_TURNO';
      const key = `${fecha}|${turno}`;

      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      let totalPernos = 0;
      for (const registro of registrosArray) {
        if (!this.esEstadoOperativoPorCodigo(registro.codigo)) continue;
        totalPernos += Number(registro.operacion?.n_pernos_instalados) || 0;
      }

      if (totalPernos <= 0) return;

      if (!mapa.has(key)) {
        mapa.set(key, { fecha, turno, total_pernos: 0 });
      }
      mapa.get(key)!.total_pernos += totalPernos;
    });

    return Array.from(mapa.values());
  }
  PernosPorLabor(): PernosLaborItem[] {
    const resultadoMap = new Map<string, PernosLaborItem>();

    this.operacionesFiltradas.forEach((op) => {
      const seccion = op.seccion || 'SIN_SECCION';
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        if (!this.esEstadoOperativoPorCodigo(registro.codigo)) continue;
        const opReg = registro.operacion!;

        const labor = opReg.labor || 'SIN LABOR';
        const nPernos = Number(opReg.n_pernos_instalados) || 0;

        if (nPernos <= 0) continue;

        const key = `${labor}|${seccion}`;

        if (!resultadoMap.has(key)) {
          resultadoMap.set(key, {
            labor,
            seccion,
            seccionLabor: labor,
            totalPernos: 0,
          });
        }

        resultadoMap.get(key)!.totalPernos += nPernos;
      }
    });

    return Array.from(resultadoMap.values());
  }

  procesarPorTipoPernoInstalado(): PernosInstaladosTipoItem[] {
    const mapa = new Map<string, number>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        if (!this.esEstadoOperativoPorCodigo(registro.codigo)) continue;
        const opReg = registro.operacion!;

        const tipo = opReg.tipo_pernos || 'SIN_TIPO';
        const nPernos = Number(opReg.n_pernos_instalados) || 0;

        if (nPernos <= 0) continue;

        mapa.set(tipo, (mapa.get(tipo) || 0) + nPernos);
      }
    });

    return Array.from(mapa.entries()).map(([tipoPernos, total]) => ({
      tipoPernos,
      total,
    }));
  }
  procesarDetalleEquipo(): DetalleEquipoItem[] {
    const mapa = new Map<
      string,
      {
        modelo_equipo: string;
        diferencia_percusion: number;
        log_pernos: number;
        metros_perforados: number;
        labores: Set<string>;
        n_pernos: number;
      }
    >();

    this.operacionesFiltradas.forEach((op) => {
      const key = this.obtenerEquipoKey(op);
      const percusion = op.horometros?.percusion;
      const difPercusion =
        percusion?.inicio != null && percusion?.final != null
          ? Number(percusion.final) - Number(percusion.inicio)
          : 0;

      if (!mapa.has(key)) {
        mapa.set(key, {
          modelo_equipo: key,
          diferencia_percusion: 0,
          log_pernos: 0,
          metros_perforados: 0,
          labores: new Set(),
          n_pernos: 0,
        });
      }

      const acc = mapa.get(key)!;
      acc.diferencia_percusion += difPercusion;

      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        if (!this.esEstadoOperativoPorCodigo(registro.codigo)) continue;
        const opReg = registro.operacion!;

        const nPernos = Number(opReg.n_pernos_instalados) || 0;
        const logPernos = Number(opReg.log_pernos) || 0;
        const metros = logPernos * nPernos * 0.3048;
        const labor = opReg.labor || 'SIN LABOR';

        acc.n_pernos += nPernos;
        acc.log_pernos += logPernos;
        acc.metros_perforados += metros;
        acc.labores.add(labor);
      }
    });

    return Array.from(mapa.values()).map((acc) => ({
      modelo_equipo: acc.modelo_equipo,
      diferencia_percusion: acc.diferencia_percusion,
      log_pernos: acc.log_pernos,
      metros_perforados: Number(acc.metros_perforados.toFixed(2)),
      n_labores_sostenidas: acc.labores.size,
      n_pernos: acc.n_pernos,
      n_pernos_por_labor:
        acc.labores.size > 0
          ? Number((acc.n_pernos / acc.labores.size).toFixed(1))
          : 0,
      sos_m_hr_hp:
        acc.diferencia_percusion > 0
          ? Number(
              (acc.metros_perforados / acc.diferencia_percusion).toFixed(2),
            )
          : 0,
    }));
  }
  procesarDetalleSostenimiento(): DetalleSostenimientoItem[] {
    const mapa = new Map<
      string,
      {
        modelo_equipo: string;
        labor_sos: string;
        seccion_labor: string;
        tipo_pernos: string;
        n_pernos: number;
        log_pernos: number;
        mt52_malla: number;
        metros_perforados: number;
        registros: number;
      }
    >();

    this.operacionesFiltradas.forEach((op) => {
      const modeloEquipo = `${op.equipo}-${op.n_equipo}`;
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        if (!this.esEstadoOperativoPorCodigo(registro.codigo)) continue;
        const opReg = registro.operacion!;

        const labor = opReg.labor || 'SIN LABOR';
        const seccionLabor = opReg.tipo_labor || 'N/A';
        const tipoPernos = opReg.tipo_pernos || 'SIN_TIPO';
        const nPernos = Number(opReg.n_pernos_instalados) || 0;
        const logPernos = Number(opReg.log_pernos) || 0;
        const malla = Number(opReg.mt52_malla) || 0;
        const metros = logPernos * nPernos * 0.3048;

        if (nPernos <= 0) continue;

        const key = `${modeloEquipo}|${labor}|${seccionLabor}|${tipoPernos}`;

        if (!mapa.has(key)) {
          mapa.set(key, {
            modelo_equipo: modeloEquipo,
            labor_sos: labor,
            seccion_labor: seccionLabor,
            tipo_pernos: tipoPernos,
            n_pernos: 0,
            log_pernos: 0,
            mt52_malla: 0,
            metros_perforados: 0,
            registros: 0,
          });
        }

        const acc = mapa.get(key)!;
        acc.n_pernos += nPernos;
        acc.log_pernos += logPernos;
        acc.mt52_malla += malla;
        acc.metros_perforados += metros;
        acc.registros += 1;
      }
    });

    return Array.from(mapa.values()).map((acc) => ({
      ...acc,
      metros_perforados: Number(acc.metros_perforados.toFixed(2)),
    }));
  }

  // =========================================
  // RENDIMIENTO EQUIPO
  // =========================================

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

          if (this.esEstadoMantenimientoPorCodigo(codigo)) {
            horasDemoraMecanica += duracion;
          }
        }

        const key = this.obtenerEquipoKey(op);

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

  // =========================================
  // PARETO HORAS OPERATIVAS
  // =========================================

  private procesarParetoBase(codigosValidos: string[]): ParetoChartItem[] {
    const resultadoMap = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      for (const registro of registrosArray) {
        const codigo = String(registro.codigo || '').trim();
        if (!codigo || !codigosValidos.includes(codigo)) continue;
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

  procesarParetoOperativas(): ParetoChartItem[] {
    return this.procesarParetoBase(this.ESTADOS_OPERATIVOS);
  }

  procesarParetoNoOperativas(): ParetoChartItem[] {
    return this.procesarParetoBase(this.ESTADOS_NO_OPERATIVOS);
  }

  procesarParetoMantenimiento(): ParetoChartItem[] {
    return this.procesarParetoBase(this.ESTADOS_MANTENIMIENTO);
  }

  // =========================================
  // M/HR POR EQUIPO
  // =========================================

  procesarMhrEquipo(): MhrEquipoItem[] {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const key = this.obtenerEquipoKey(op);

      let metros = 0;
      for (const r of registrosArray) {
        if (!this.esEstadoOperativoPorCodigo(r.codigo)) continue;
        if (r.operacion) {
          metros += this.obtenerMetrosPerforadosRegistro(r.operacion);
        }
      }

      const perc = op.horometros?.percusion;
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
  // METROS PERFORADOS POR EQUIPO
  // =========================================

  procesarMetrosEquipo(): PerforadoEquipoChartItem[] {
    const mapa = new Map<string, PerforadoEquipoChartItem>();

    this.operacionesFiltradas.forEach((op) => {
      try {
        const registrosArray = op.registros;
        if (!Array.isArray(registrosArray) || registrosArray.length === 0)
          return;

        let metros = 0;
        for (const r of registrosArray) {
          if (!this.esEstadoOperativoPorCodigo(r.codigo)) continue;
          if (!r.operacion) continue;
          metros += this.obtenerMetrosPerforadosRegistro(r.operacion);
        }

        const key = this.obtenerEquipoKey(op);

        if (mapa.has(key)) {
          mapa.get(key)!.metrosPerforados += metros;
        } else {
          mapa.set(key, {
            modeloEquipo: key,
            seccion: op.seccion || 'SIN_SECCION',
            metrosPerforados: metros,
          });
        }
      } catch (error) {}
    });

    return Array.from(mapa.values());
  }

  // =========================================
  // HOROMETROS POR EQUIPO
  // =========================================

  procesarHorometrosEquipo(): HorometroEquipoItem[] {
    const mapa = new Map<string, HorometroEquipoItem>();

    this.operacionesFiltradas.forEach((op) => {
      const key = this.obtenerEquipoKey(op);
      const horo = op.horometros;

      const difDiesel =
        horo?.diesel?.inicio != null && horo?.diesel?.final != null
          ? Number(horo.diesel.final) - Number(horo.diesel.inicio)
          : 0;

      const difElectrico =
        horo?.electrico?.inicio != null && horo?.electrico?.final != null
          ? Number(horo.electrico.final) - Number(horo.electrico.inicio)
          : 0;

      const difPercusion =
        horo?.percusion?.inicio != null && horo?.percusion?.final != null
          ? Number(horo.percusion.final) - Number(horo.percusion.inicio)
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
      item.diesel! += difDiesel;
      item.electrico! += difElectrico;
      item.percusion! += difPercusion;
    });

    return Array.from(mapa.values());
  }

  // =========================================
  // TOTAL HOROMETROS
  // =========================================

  procesarTotalHorometros(): TotalHorometroItem[] {
    let totalDiesel = 0;
    let totalElectrico = 0;
    let totalPercusion = 0;

    this.operacionesFiltradas.forEach((op) => {
      const horo = op.horometros;

      if (horo?.diesel?.inicio != null && horo?.diesel?.final != null) {
        totalDiesel += Number(horo.diesel.final) - Number(horo.diesel.inicio);
      }

      if (horo?.electrico?.inicio != null && horo?.electrico?.final != null) {
        totalElectrico +=
          Number(horo.electrico.final) - Number(horo.electrico.inicio);
      }

      if (horo?.percusion?.inicio != null && horo?.percusion?.final != null) {
        totalPercusion +=
          Number(horo.percusion.final) - Number(horo.percusion.inicio);
      }
    });

    return [
      {
        diesel: Number(totalDiesel.toFixed(2)),
        electrico: Number(totalElectrico.toFixed(2)),
        percusion: Number(totalPercusion.toFixed(2)),
      },
    ];
  }

  // =========================================
  // MAPA DE CALOR
  // =========================================

  procesarMapaCalor(): MapaDeCalorItem[] {
    const result: MapaDeCalorItem[] = [];

    this.operacionesFiltradas.forEach((op) => {
      const modelo = this.obtenerEquipoKey(op);
      const fecha = op.fecha || 'SIN_FECHA';

      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      registrosArray.forEach((r) => {
        const codigo = String(r?.codigo || '');
        if (codigo !== '101' && codigo !== '111') return;

        const horaStr = r?.hora_inicio;
        if (!horaStr) return;

        const partes = horaStr.split(':').map(Number);
        const h = partes[0] || 0;
        const m = partes[1] || 0;
        const s = partes[2] || 0;
        const hora_decimal = h + m / 60 + s / 3600;

        result.push({
          modelo_equipo: modelo,
          fecha,
          hora_inicio: horaStr,
          hora_decimal,
          codigo,
        });
      });
    });

    return result.sort((a, b) => {
      if (a.fecha === b.fecha) return a.hora_decimal - b.hora_decimal;
      return a.fecha.localeCompare(b.fecha);
    });
  }

  // =========================================
  // HORA PRIMERA PERFORACION (LABOR FR)
  // =========================================

  procesarLaborFR(): HoraPrimeraPerforacionItem[] {
    const mapa = new Map<string, Map<string, any>>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const modelo = this.obtenerEquipoKey(op);
      const fecha = op.fecha || 'SIN_FECHA';

      let mejorRegistro: any = null;
      let mejorHora = Infinity;

      for (const r of registrosArray) {
        if (!this.esEstadoOperativoPorCodigo(r.codigo)) continue;
        const hora = r?.hora_inicio;
        if (!hora) continue;

        const [h, m] = hora.split(':').map(Number);
        const horaDecimal = h + m / 60;

        if (horaDecimal < mejorHora) {
          mejorHora = horaDecimal;
          mejorRegistro = r;
        }
      }

      if (!mejorRegistro) return;

      const operacion = (mejorRegistro?.operacion || mejorRegistro) as any;
      const tipoLabor = operacion?.tipo_labor || '';
      const labor = operacion?.labor || '';
      const ala = operacion?.ala || '';
      const labor_fr = `${tipoLabor}${labor}${ala}`;

      if (!mapa.has(modelo)) {
        mapa.set(modelo, new Map());
      }

      const mapaFechas = mapa.get(modelo)!;
      mapaFechas.set(fecha, {
        modelo_equipo: modelo,
        fecha,
        hora_inicio: mejorRegistro.hora_inicio,
        labor_fr,
      });
    });

    const result: any[] = [];
    for (const [, fechasMap] of mapa.entries()) {
      fechasMap.forEach((value) => result.push(value));
    }

    return result.sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  // =========================================
  // FR POR OPERADOR TURNO
  // =========================================

  procesarFrPorOperadorTurno(): RankingOperadorItem[] {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const operador = op.operador || 'SIN_OPERADOR';
      const turno = op.turno || 'SIN_TURNO';
      const key = `${operador}-${turno}`;

      let metros = 0;
      for (const r of registrosArray) {
        if (!this.esEstadoOperativoPorCodigo(r.codigo)) continue;
        if (r.operacion) {
          metros += this.obtenerMetrosPerforadosRegistro(r.operacion);
        }
      }

      const horo = op.horometros;
      const percusion = horo?.percusion;
      const difPercusion =
        percusion?.inicio != null && percusion?.final != null
          ? Number(percusion.final) - Number(percusion.inicio)
          : 0;

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

    for (const item of mapa.values()) {
      item.fr_mhr_hp =
        item.dif_percusion > 0
          ? item.metros_perforados / item.dif_percusion
          : 0;
    }

    return Array.from(mapa.values());
  }

  // =========================================
  // LABOR FR DETALLADO (OBSERVACIONES)
  // =========================================

  procesarLaborFRDetallado(): ObservacionItem[] {
    const mapa = new Map<string, any>();

    this.operacionesFiltradas.forEach((op) => {
      const registrosArray = op.registros;
      if (!Array.isArray(registrosArray)) return;

      const modelo = this.obtenerEquipoKey(op);
      const operador = op.operador || 'SIN_OPERADOR';

      registrosArray.forEach((r) => {
        if (!this.esEstadoOperativoPorCodigo(r.codigo)) return;

        const operacion = (r?.operacion || {}) as OperacionSostenimiento;
        const tipoLabor = operacion?.tipo_labor || '';
        const labor = operacion?.labor || '';
        const ala = operacion?.ala || '';
        const observaciones = operacion?.observaciones;

        if (!observaciones || !observaciones.trim()) return;

        const labor_fr = `${tipoLabor}${labor}${ala}`.trim();
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

        mapa.get(key)!.count += 1;
      });
    });

    return Array.from(mapa.values());
  }

  private esEstadoOperativoPorCodigo(codigo: string): boolean {
    return this.ESTADOS_OPERATIVOS.includes(codigo);
  }

  quitarFiltro() {
    this.operacionesFiltradas = [...this.operacionesOriginal];
    this.fechaInicio = '';
    this.fechaFin = '';
    this.turnoAplicado = '';
    this.turnoSeleccionado = '';

    this.procesarTodo();
  }
}
