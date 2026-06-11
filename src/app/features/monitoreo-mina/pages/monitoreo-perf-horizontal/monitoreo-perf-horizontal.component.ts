import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { Subject, of, timer } from 'rxjs';
import {
  catchError,
  exhaustMap,
  finalize,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Ajusta esta ruta según tu proyecto
import {
  convertirNumero,
  formatearFechaYYYYMMDD,
  normalizarTexto,
} from '../../../../utils/fecha-utils';
import { OperacionesService } from '../../../../services/operaciones.service';
import {
  calcularZoomInicial,
  CHART_THEME,
} from '../../../../config/chart-theme';
import { OperacionJumbo } from '../../../../models/OperacionJumbo';
import { DialogModule } from 'primeng/dialog';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

interface OperacionMonitor {
  id?: string | number;
  fecha: string;
  turno: string;
  equipo: string;
  operador: string;
  registros: number;
  horaInicio: string;
  horaFinal: string;
  estado: string;
  observaciones: number;
}

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-monitoreo-perf-horizontal',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ProgressSpinnerModule,

    DialogModule,
    NgxEchartsDirective,
  ],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './monitoreo-perf-horizontal.component.html',
  styleUrl: './monitoreo-perf-horizontal.component.css',
})
export class MonitoreoPerfHorizontalComponent implements OnInit, OnDestroy {
  private operacionesService = inject(OperacionesService);
  private destroy$ = new Subject<void>();

  readonly tipoOperacion = 'tal_horizontal';
  readonly nombreOperacion = 'PERFORACIÓN HORIZONTAL';
  readonly intervaloMs = 30_000;

  operacionesOriginal: any[] = [];
  operacionesVista: OperacionMonitor[] = [];

  cargando = false;
  monitoreoActivo = false;
  error: string | null = null;

  ultimaActualizacion: Date | null = null;

  resumen = {
    totalOperaciones: 0,
    totalEquipos: 0,
    totalOperadores: 0,
    totalRegistros: 0,
    totalObservaciones: 0,
  };

  mostrarDialogHoraHora = false;
  chartHoraHoraOptions: any = {};
  turnoActual = {
    codigo: '',
    nombre: '',
  };

  ngOnInit(): void {
    this.iniciarMonitoreo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  iniciarMonitoreo(): void {
    this.monitoreoActivo = true;

    timer(0, this.intervaloMs)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.cargando = true;
          this.error = null;
        }),
        exhaustMap(() =>
          this.operacionesService.getAllAprobados(this.tipoOperacion).pipe(
            catchError((err) => {
              console.error('Error cargando operaciones:', err);
              this.error =
                'No se pudo actualizar la información del monitoreo.';
              return of(null);
            }),
            finalize(() => {
              this.cargando = false;
            }),
          ),
        ),
      )
      .subscribe((resp: any) => {
        this.aplicarDataMonitoreo(resp);
      });
  }
  private obtenerTurnoActual(): { codigo: 'DIA' | 'NOCHE'; nombre: string } {
    const hora = new Date().getHours();

    if (hora >= 7 && hora < 19) {
      return {
        codigo: 'DIA',
        nombre: 'TURNO DÍA',
      };
    }

    return {
      codigo: 'NOCHE',
      nombre: 'TURNO NOCHE',
    };
  }
  private obtenerContextoTurnoActual(): {
    turno: 'DIA' | 'NOCHE';
    fechaOperacion: string;
  } {
    const ahora = new Date();
    const hora = ahora.getHours();

    // Turno día: 07:00 a 18:59
    if (hora >= 7 && hora < 19) {
      return {
        turno: 'DIA',
        fechaOperacion: formatearFechaYYYYMMDD(ahora),
      };
    }

    // Turno noche desde 19:00 hasta 23:59
    if (hora >= 19) {
      return {
        turno: 'NOCHE',
        fechaOperacion: formatearFechaYYYYMMDD(ahora),
      };
    }

    // Turno noche desde 00:00 hasta 06:59
    // Pertenece a la operación del día anterior
    const ayer = new Date(ahora);
    ayer.setDate(ayer.getDate() - 1);

    return {
      turno: 'NOCHE',
      fechaOperacion: formatearFechaYYYYMMDD(ayer),
    };
  }
  private obtenerHorasTurno(turno: 'DIA' | 'NOCHE'): number[] {
    if (turno === 'DIA') {
      return this.rangoHoras(7, 18);
    }

    return [...this.rangoHoras(19, 23), ...this.rangoHoras(0, 6)];
  }
  private perteneceAlTurnoActual(
    hora: number,
    turno: 'DIA' | 'NOCHE',
  ): boolean {
    if (turno === 'DIA') {
      return hora >= 7 && hora < 19;
    }

    return hora >= 19 || hora < 7;
  }
  private rangoHoras(inicio: number, fin: number): number[] {
    const horas: number[] = [];

    for (let h = inicio; h <= fin; h++) {
      horas.push(h);
    }

    return horas;
  }
  private formatearHora(hora: number): string {
    return `${String(hora).padStart(2, '0')}:00`;
  }

  private convertirHoraDecimal(horaStr: string): number | null {
    if (!horaStr) return null;

    const partes = String(horaStr).split(':').map(Number);

    const h = partes[0];
    const m = partes[1] || 0;
    const s = partes[2] || 0;

    if (Number.isNaN(h)) return null;

    return h + m / 60 + s / 3600;
  }
  abrirDialogHoraHora(): void {
    this.actualizarGraficoHoraHora();
    this.mostrarDialogHoraHora = true;
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

  private actualizarGraficoHoraHora(): void {
    const turno = this.obtenerTurnoActual();
    this.turnoActual = turno;

    const horasTurno = this.obtenerHorasTurno(turno.codigo);
    const horasLabels = horasTurno.map((hora) => this.formatearHora(hora));

    const acumulado = new Map<string, number>();
    const equiposSet = new Set<string>();

    for (const op of this.operacionesOriginal || []) {
      const equipo = op?.modelo_equipo || op?.equipo || 'SIN_EQUIPO';
      const registrosArray = Array.isArray(op?.registros) ? op.registros : [];

      for (const r of registrosArray) {
        const operacion = r?.operacion || r;

        const horaInicio = operacion?.hora_inicio || r?.hora_inicio;
        if (!horaInicio) continue;

        const horaDecimal = this.convertirHoraDecimal(horaInicio);
        if (horaDecimal === null) continue;

        const horaBucket = Math.floor(horaDecimal) % 24;

        if (!this.perteneceAlTurnoActual(horaBucket, turno.codigo)) continue;

        const metros = this.obtenerMetrosPerforadosRegistro(operacion);
        if (metros <= 0) continue;

        equiposSet.add(equipo);

        const key = `${equipo}|${horaBucket}`;
        acumulado.set(key, (acumulado.get(key) || 0) + metros);
      }
    }

    const equipos = Array.from(equiposSet).sort();

    const series = equipos.map((equipo) => {
      return {
        name: equipo,
        type: 'bar',
        stack: 'metros',
        barMaxWidth: 32,
        emphasis: {
          focus: 'series',
        },
        data: horasTurno.map((hora) => {
          const key = `${equipo}|${hora}`;
          return Number((acumulado.get(key) || 0).toFixed(2));
        }),
      };
    });

    const totalPorHora = horasTurno.map((hora) => {
      return equipos.reduce((sum, equipo) => {
        const key = `${equipo}|${hora}`;
        return sum + Number(acumulado.get(key) || 0);
      }, 0);
    });

    const totalMetrosTurno = totalPorHora.reduce(
      (sum, value) => sum + value,
      0,
    );

    this.chartHoraHoraOptions = {
      color: [
        CHART_THEME.colors.primary,
        CHART_THEME.colors.success,
        CHART_THEME.colors.warning,
        CHART_THEME.colors.secondary,
        CHART_THEME.colors.primary75,
        CHART_THEME.colors.primary50,
      ],

      title: {
        ...CHART_THEME.title,
        text: `METROS PERFORADOS HORA-HORA - ${turno.nombre}`,
        subtext: `Total turno: ${totalMetrosTurno.toFixed(2)} m`,
        left: 'center',
        top: 8,
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any[]) => {
          if (!Array.isArray(params) || params.length === 0) return '';

          const hora = params[0]?.axisValue || '';
          const total = params.reduce(
            (sum, item) => sum + Number(item.value || 0),
            0,
          );

          const detalle = params
            .filter((item) => Number(item.value || 0) > 0)
            .map((item) => {
              return `
              ${item.marker}
              ${item.seriesName}: <strong>${Number(item.value || 0).toFixed(2)} m</strong>
            `;
            })
            .join('<br/>');

          return `
          <strong>${hora}</strong><br/>
          Total: <strong>${total.toFixed(2)} m</strong>
          <hr style="margin: 6px 0"/>
          ${detalle || 'Sin metros perforados'}
        `;
        },
      },

      legend: {
        ...CHART_THEME.legend,
        type: 'scroll',
        top: 48,
        left: 'center',
      },

      grid: {
        ...CHART_THEME.grid,
        top: 95,
        left: '4%',
        right: '4%',
        bottom: 60,
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        data: horasLabels,
        axisLabel: {
          ...CHART_THEME.xAxisCategory.axisLabel,
          interval: 0,
          rotate: 0,
          fontSize: 11,
          fontWeight: 'bold',
        },
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: CHART_THEME.colors.textMuted,
          },
        },
      },

      yAxis: {
        type: 'value',
        name: 'Metros perforados',
        nameLocation: 'middle',
        nameGap: 58,
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          formatter: '{value} m',
        },
        splitLine: CHART_THEME.yAxisValue.splitLine,
      },

      dataZoom: [
        {
          ...CHART_THEME.dataZoom.slider,
          start: 0,
          end: 100,
          bottom: 18,
          height: 18,
        },
        {
          ...CHART_THEME.dataZoom.inside,
          start: 0,
          end: 100,
        },
      ],
      series,
    };
  }

  detenerMonitoreo(): void {
    this.monitoreoActivo = false;
    this.destroy$.next();
  }

  private aplicarDataMonitoreo(resp: any): void {
    if (!resp) return;

    const dataBackend = Array.isArray(resp.data) ? resp.data : [];

    const contextoTurno = this.obtenerContextoTurnoActual();

    const dataFiltrada = this.filtrarOperacionesTurnoActual(
      dataBackend,
      contextoTurno.fechaOperacion,
      contextoTurno.turno,
    );

    this.operacionesOriginal = dataFiltrada;

    this.operacionesVista = this.procesarOperacionesMonitor(
      this.operacionesOriginal,
    );

    this.resumen = this.calcularResumen(this.operacionesOriginal);
    this.ultimaActualizacion = new Date();

    this.actualizarGraficoHoraHora();
  }

  refrescarAhora(): void {
    if (this.cargando) return;

    this.cargando = true;
    this.error = null;

    this.operacionesService
      .getAllAprobados(this.tipoOperacion)
      .pipe(
        catchError((err) => {
          console.error('Error refrescando operaciones:', err);
          this.error = 'No se pudo refrescar la información.';
          return of(null);
        }),
        finalize(() => {
          this.cargando = false;
        }),
      )
      .subscribe((resp: any) => {
        this.aplicarDataMonitoreo(resp);
      });
  }
  private filtrarOperacionesTurnoActual(
    data: any[],
    fechaOperacion: string,
    turnoActual: 'DIA' | 'NOCHE',
  ): any[] {
    return data.filter((op: any) => {
      const fechaOp = String(op?.fecha || '').trim();

      const turnoOp = normalizarTexto(op?.turno);

      const coincideFecha = fechaOp === fechaOperacion;

      const coincideTurno =
        turnoActual === 'DIA' ? turnoOp === 'DIA' : turnoOp === 'NOCHE';

      return coincideFecha && coincideTurno;
    });
  }

  private procesarOperacionesMonitor(data: any[]): OperacionMonitor[] {
    return data
      .map((op: any) => {
        const registrosArray = Array.isArray(op?.registros) ? op.registros : [];

        const horasInicio = registrosArray
          .map((r: any) => r?.hora_inicio || r?.operacion?.hora_inicio)
          .filter(Boolean)
          .sort();

        const horasFinal = registrosArray
          .map((r: any) => r?.hora_final || r?.operacion?.hora_final)
          .filter(Boolean)
          .sort();

        const observaciones = registrosArray.filter((r: any) => {
          const obs = r?.observaciones || r?.operacion?.observaciones;
          return obs && String(obs).trim().length > 0;
        }).length;

        return {
          id: op?.id || op?._id,
          fecha: op?.fecha || 'SIN_FECHA',
          turno: op?.turno || 'SIN_TURNO',
          equipo: op?.modelo_equipo || op?.equipo || 'SIN_EQUIPO',
          operador: op?.operador || 'SIN_OPERADOR',
          registros: registrosArray.length,
          horaInicio: horasInicio[0] || '-',
          horaFinal: horasFinal[horasFinal.length - 1] || '-',
          estado: op?.estado || 'APROBADO',
          observaciones,
        };
      })
      .sort((a, b) => {
        const diffFecha = String(b.fecha).localeCompare(String(a.fecha));
        if (diffFecha !== 0) return diffFecha;

        return String(b.horaInicio).localeCompare(String(a.horaInicio));
      });
  }

  private calcularResumen(data: any[]) {
    const equipos = new Set<string>();
    const operadores = new Set<string>();

    let totalRegistros = 0;
    let totalObservaciones = 0;

    data.forEach((op: any) => {
      equipos.add(op?.modelo_equipo || op?.equipo || 'SIN_EQUIPO');
      operadores.add(op?.operador || 'SIN_OPERADOR');

      const registrosArray = Array.isArray(op?.registros) ? op.registros : [];
      totalRegistros += registrosArray.length;

      registrosArray.forEach((r: any) => {
        const obs = r?.observaciones || r?.operacion?.observaciones;
        if (obs && String(obs).trim().length > 0) {
          totalObservaciones++;
        }
      });
    });

    return {
      totalOperaciones: data.length,
      totalEquipos: equipos.size,
      totalOperadores: operadores.size,
      totalRegistros,
      totalObservaciones,
    };
  }

  getEstadoSeverity(estado: string): 'success' | 'info' | 'warning' | 'danger' {
    const estadoNormalizado = normalizarTexto(estado);

    if (estadoNormalizado.includes('APROBADO')) return 'success';
    if (estadoNormalizado.includes('PENDIENTE')) return 'warning';
    if (estadoNormalizado.includes('OBSERVADO')) return 'danger';

    return 'info';
  }
}
