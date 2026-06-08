import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

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
import { CHART_THEME } from '../../../../shared/chart-theme';
import { OperacionJumbo } from '../../../../models/OperacionJumbo';

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
  selector: 'app-dialog-hora-hora-perforacion',
  standalone: true,
  imports: [CommonModule, DialogModule, TagModule, NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './dialog-hora-hora-perforacion.component.html',
  styleUrl: './dialog-hora-hora-perforacion.component.css',
})
export class DialogHoraHoraPerforacionComponent implements OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() data: any[] = [];

  /**
   * Para principal-grafico-horizontal:
   * turno = '', 'DIA', 'NOCHE'
   *
   * Para monitoreo:
   * usarTurnoActual = true
   */
  @Input() turno: string | null = '';
  @Input() usarTurnoActual = false;

  @Input() fechaInicio: string | null = null;
  @Input() fechaFin: string | null = null;

  @Input() titulo = 'Metros perforados hora-hora';
  @Input() subtitulo = 'Perforación horizontal por jumbos';

  chartHoraHoraOptions: any = {};
  totalMetrosHoraHora = 0;

  textoTurno = 'TODOS';

  private chartInstance: any;

  ESTADOS_OPERATIVOS = ['101', '102', '111', '112', '120'];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['data'] ||
      changes['turno'] ||
      changes['usarTurnoActual'] ||
      changes['visible']
    ) {
      if (this.visible) {
        this.actualizarGraficoHoraHora();
        this.redimensionarGrafico();
      }
    }
  }

  onVisibleChange(value: boolean): void {
    this.visible = value;
    this.visibleChange.emit(value);

    if (value) {
      this.actualizarGraficoHoraHora();
      this.redimensionarGrafico();
    }
  }

  onChartInit(ec: any): void {
    this.chartInstance = ec;
  }

  private esEstadoOperativo(codigo: string): boolean {
    return this.ESTADOS_OPERATIVOS.includes(codigo);
  }

  private redimensionarGrafico(): void {
    setTimeout(() => {
      this.chartInstance?.resize();
    }, 150);
  }

  private actualizarGraficoHoraHora(): void {
    const turnoNormalizado = this.obtenerTurnoGrafico();

    this.textoTurno = this.obtenerTextoTurno(turnoNormalizado);

    const horasTurno = this.obtenerHorasPorTurno(turnoNormalizado);
    const horasLabels = horasTurno.map((hora) => this.formatearHora(hora));

    const acumulado = new Map<string, number>();
    const equiposSet = new Set<string>();

    for (const op of this.data || []) {
      const equipo = op?.modelo_equipo || op?.equipo || 'SIN_EQUIPO';
      const registrosArray = Array.isArray(op?.registros) ? op.registros : [];

      for (const r of registrosArray) {
        const operacion = r?.operacion || r;
        const codigo = r.codigo.toString().trim();

        const horaInicio = r?.hora_inicio || operacion?.['hora_inicio'];
        if (!horaInicio) continue;

        if (!this.esEstadoOperativo(codigo)) continue;

        const horaDecimal = this.convertirHoraDecimal(horaInicio);
        if (horaDecimal === null) continue;

        const horaBucket = Math.floor(horaDecimal) % 24;

        if (!this.perteneceAlTurno(horaBucket, turnoNormalizado)) continue;

        const metros = this.obtenerMetrosPerforadosRegistro(operacion);
        if (metros <= 0) continue;

        equiposSet.add(equipo);

        const key = `${equipo}|${horaBucket}`;
        acumulado.set(key, (acumulado.get(key) || 0) + metros);
      }
    }

    const equipos = Array.from(equiposSet).sort();

    const series = equipos.map((equipo) => ({
      name: equipo,
      type: 'bar',
      stack: 'metros',
      barMaxWidth: 34,
      emphasis: {
        focus: 'series',
      },
      data: horasTurno.map((hora) => {
        const key = `${equipo}|${hora}`;
        return Number((acumulado.get(key) || 0).toFixed(2));
      }),
    }));

    const totalPorHora = horasTurno.map((hora) => {
      return equipos.reduce((sum, equipo) => {
        const key = `${equipo}|${hora}`;
        return sum + Number(acumulado.get(key) || 0);
      }, 0);
    });

    this.totalMetrosHoraHora = totalPorHora.reduce(
      (sum, value) => sum + value,
      0,
    );

    const mostrarZoom = horasTurno.length > 10;

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
        text: 'METROS PERFORADOS HORA-HORA',
        subtext: `Total: ${this.totalMetrosHoraHora.toFixed(2)} m`,
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
        left: '11%',
        right: '4%',
        bottom: mostrarZoom ? 70 : 45,
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
        nameGap: 60,
        nameRotate: 90,
        nameTextStyle: {
          color: CHART_THEME.colors.textMuted,
          fontSize: 11,
          fontWeight: 'bold',
        },
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          formatter: '{value} m',
          margin: 12,
        },
        splitLine: CHART_THEME.yAxisValue.splitLine,
      },

      dataZoom: mostrarZoom
        ? [
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
          ]
        : [],

      series,
    };
  }

  private obtenerTurnoGrafico(): string {
    if (this.usarTurnoActual) {
      return this.obtenerTurnoActual();
    }

    return this.normalizarTexto(this.turno);
  }

  private obtenerTurnoActual(): 'DIA' | 'NOCHE' {
    const hora = new Date().getHours();

    if (hora >= 7 && hora < 19) {
      return 'DIA';
    }

    return 'NOCHE';
  }

  private obtenerHorasPorTurno(turno: string): number[] {
    if (turno === 'DIA') {
      return this.rangoHoras(7, 18);
    }

    if (turno === 'NOCHE') {
      return [...this.rangoHoras(19, 23), ...this.rangoHoras(0, 6)];
    }

    return this.rangoHoras(0, 23);
  }

  private perteneceAlTurno(hora: number, turno: string): boolean {
    if (turno === 'DIA') {
      return hora >= 7 && hora < 19;
    }

    if (turno === 'NOCHE') {
      return hora >= 19 || hora < 7;
    }

    return true;
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

  private obtenerMetrosPerforadosRegistro(operacion: OperacionJumbo): number {
    if (!operacion) return 0;

    const talProd = this.convertirNumero(operacion.tal_prod);
    const talRimados = this.convertirNumero(operacion.tal_rimados);
    const talAlivio = this.convertirNumero(operacion.tal_alivio);
    const talRepaso = this.convertirNumero(operacion.tal_repaso);

    const longBarras = this.convertirNumero(operacion.long_barras);

    const totalTaladros = talProd + talRimados + talAlivio + talRepaso;

    const metrosPerforados = totalTaladros * longBarras * 0.3048;

    return Number(metrosPerforados.toFixed(2));
  }

  private convertirNumero(valor: any): number {
    if (valor === null || valor === undefined || valor === '') {
      return 0;
    }

    const numero = Number(String(valor).trim().replace(',', '.'));

    return Number.isNaN(numero) ? 0 : numero;
  }

  private obtenerTextoTurno(turno: string): string {
    if (turno === 'DIA') return 'DÍA';
    if (turno === 'NOCHE') return 'NOCHE';
    return 'TODOS';
  }

  private normalizarTexto(valor: any): string {
    return String(valor || '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }
}
