import { Component, OnInit } from '@angular/core';
import { OperacionBase } from '../../../../../models/OperacionBase.models';
import { PlanProduccion } from '../../../../../models/plan_produccion.model';
import { PlanProduccionService } from '../../../../../services/plan-produccion.service';
import { FechasPlanMensualService } from '../../../../../services/fechas-plan-mensual.service';
import { OperacionesService } from '../../../../../services/operaciones.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumenComponent } from '../Graficos components/Hoja 1/resumen/resumen.component';
import { PernosEquipoComponent } from '../Graficos components/Hoja 1/pernos-equipo/pernos-equipo.component';
import { PernosLaborComponent } from '../Graficos components/Hoja 1/pernos-labor/pernos-labor.component';
import { RendimientoEquipoChartComponent } from '../../../../../features/dashboard/components/rendimiento-equipo-chart/rendimiento-equipo-chart.component';
import { DemorasOperativasComponent } from '../Graficos components/Hoja 1/demoras-operativas/demoras-operativas.component';
import { DemorasInoperativasComponent } from '../Graficos components/Hoja 1/demoras-inoperativas/demoras-inoperativas.component';
import { HorasMantenimientoComponent } from '../Graficos components/Hoja 1/horas-mantenimiento/horas-mantenimiento.component';
import { PernosInstaladosTipoComponent } from '../Graficos components/Hoja 1/pernos-instalados-tipo/pernos-instalados-tipo.component';
import { MhrEquipoComponent, MhrEquipoItem } from '../../../../../features/dashboard/components/mhr-equipo/mhr-equipo.component';
import { MetrosEquipoComponent } from '../Graficos components/Hoja 1/metros-equipo/metros-equipo.component';
import { HorometroEmpernadorComponent } from '../Graficos components/Hoja 1/horometro-empernador/horometro-empernador.component';
import { TotalHorometrosComponent, TotalHorometroItem } from '../../../../../features/dashboard/components/total-horometros/total-horometros.component';
import { ScatterTurnosNocheComponent } from '../Graficos components/Hoja 2/scatter-turnos-noche/scatter-turnos-noche.component';
import { ScatterTurnosComponent } from '../Graficos components/Hoja 2/scatter-turnos/scatter-turnos.component';
import { PlanMensualService } from '../../../../../services/plan-mensual.service';
import { PernosMinadoTipoComponent } from '../Graficos components/Hoja 2/pernos-minado-tipo/pernos-minado-tipo.component';
import { HorasPrimeraPerforacionComponent, HoraPrimeraPerforacionItem } from '../../../../../features/dashboard/components/horas-primera-perforacion/horas-primera-perforacion.component';
import { DetalleEquipoComponent } from '../Graficos components/Hoja 2/detalle-equipo/detalle-equipo.component';
import { DetalleSostenimientoComponent } from '../Graficos components/Hoja 2/detalle-sostenimiento/detalle-sostenimiento.component';
import { MejoresOperadoresComponent, MejoresOperadorItem } from '../../../../../features/dashboard/components/mejores-operadores/mejores-operadores.component';
import { RankingOperadorComponent, RankingOperadorItem } from '../../../../../features/dashboard/components/ranking-operador/ranking-operador.component';
import { ObservacionesComponent } from '../Graficos components/Hoja 2/observaciones/observaciones.component';
import { PernosDiaComponent } from '../Graficos components/Hoja 1/pernos-dia/pernos-dia.component';
import { SchedulerComponent } from '../../Linea de tiempo/scheduler/scheduler.component';
import { EstadoService } from '../../../../../services/estado.service';

@Component({
  selector: 'app-principal-grafico-sostenimiento',
  imports: [
    CommonModule,
    FormsModule,
    ResumenComponent,
    PernosEquipoComponent,
    PernosLaborComponent,
    RendimientoEquipoChartComponent,
    DemorasOperativasComponent,
    DemorasInoperativasComponent,
    HorasMantenimientoComponent,
    PernosInstaladosTipoComponent,
    MhrEquipoComponent,
    MetrosEquipoComponent,
    HorometroEmpernadorComponent,
    TotalHorometrosComponent,
    ScatterTurnosComponent,
    ScatterTurnosNocheComponent,
    PernosMinadoTipoComponent,
    HorasPrimeraPerforacionComponent,
    DetalleEquipoComponent,
    DetalleSostenimientoComponent,
    MejoresOperadoresComponent,
    RankingOperadorComponent,
    ObservacionesComponent,
    PernosDiaComponent,
    SchedulerComponent,
  ],
  templateUrl: './principal-grafico-sostenimiento.component.html',
  styleUrl: './principal-grafico-sostenimiento.component.css',
})
export class PrincipalGraficoSostenimientoComponent implements OnInit {
  anio!: number;
  mes!: string;

  // DATA ORIGINAL (sin filtrar)
  operacionesOriginal: OperacionBase[] = [];
  operacionesFiltradas: OperacionBase[] = [];
  planesMensuales: PlanProduccion[] = [];

  fechaInicio: string = '';
  fechaFin: string = '';
  turnoSeleccionado: string = '';
  turnoAplicado: string = '';
  cargandoPDF = false;
  DataPernosPorEquipo: any[] = [];
  dataPernoDia: any[] = [];
  DataPernosPorLabor: any[] = [];
  DataDMyUTI: any[] = [];
  DataEstadosSOS: any[] = [];
  dataDemoraIno: any[] = [];
  dataHoraMantenimiento: any[] = [];
  dataPernosInstalados: any[] = [];
  dataMHREquipo: MhrEquipoItem[] = [];
  dataMetrosEquipo: any[] = [];
  dataHorometrosEquipo: any[] = [];
  dataHorometroGeneral: TotalHorometroItem[] = [];

  //HOJA 2
  dataHorasNumericas: any[] = [];
  dataPernosMinadoTipo: any[] = [];
  dataProcesoLaborFR: HoraPrimeraPerforacionItem[] = [];
  dataIndicadores: any[] = [];
  dataIndicadoresLabor: any[] = [];
  dataFrPorOperadorTurno: RankingOperadorItem[] = [];
  dataLaborFRDetallado: any[] = [];

  resumen = {
    conteoEquipos: 0,
    totalLaboresSostenidas: 0,
    nPernoDia: 0,
    totalMetros: 0,
  };
estadosProceso: any[] = [];
    ganttData: any[] = [];
vistaPrincipal: boolean = true;

  constructor(
    private planMensualService: PlanMensualService,
    private fechasPlanMensualService: FechasPlanMensualService,
    private operacionesService: OperacionesService,
    private estadoService: EstadoService
  ) {}

  ngOnInit(): void {
    this.obtenerUltimaFecha();

    this.cargarOperaciones();
    this.obtenerEstadosPorProceso('EMPERNADOR');
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
    const tipo = 'empernador';

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

    

    //console.log('🔥 DATA DISPAROS EQUIPO:', this.dataDisparosEquipo);
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

  


  
  
  

  

}
