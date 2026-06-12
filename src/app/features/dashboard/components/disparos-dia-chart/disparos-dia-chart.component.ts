import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';
import {
  calcularZoomInicial,
  CHART_THEME,
  getTurnoColor,
} from '../../../../config/chart-theme';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
]);

export interface DisparosDiaItem {
  fecha: string;
  n_frentes: number;
  turno?: string;
}

@Component({
  selector: 'app-disparos-dia',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './disparos-dia-chart.component.html',
  styleUrl: './disparos-dia-chart.component.css',
})
export class DisparosDiaChartComponent implements OnChanges {
  @Input() data: DisparosDiaItem[] = [];

  chartOptions: any = {};
  private chartInstance: any;

  onChartInit(ec: any): void {
    this.chartInstance = ec;
  }

  getChartImage(): string | null {
    if (!this.chartInstance) return null;

    return this.chartInstance.getDataURL({
      type: 'jpeg',
      pixelRatio: 1.2,
      backgroundColor: '#FFFFFF',
      excludeComponents: ['toolbox', 'dataZoom'],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.actualizarGrafico();
    }
  }

  actualizarGrafico(): void {
    const normalizedData = this.normalizeData(this.data);

    if (normalizedData.length === 0) {
      this.chartOptions = {};
      return;
    }

    const hasTurno = normalizedData.some((item) => item.turno);

    if (hasTurno) {
      this.construirStackedBars(normalizedData);
    } else {
      this.construirSimpleBars(normalizedData);
    }
  }

  private construirStackedBars(data: DisparosDiaItem[]): void {
    const fechas = Array.from(new Set(data.map((item) => item.fecha)))
      .filter(Boolean)
      .sort();

    const turnos = Array.from(
      new Set(data.map((item) => item.turno || 'SIN TURNO')),
    ).sort((a, b) => this.ordenTurno(a) - this.ordenTurno(b));

    const xAxisData = fechas.map((fecha) => this.formatearFecha(fecha));

    const series = turnos.map((turno, index) => {
      const esUltimaSerie = index === turnos.length - 1;

      return {
        name: turno,
        type: 'bar',
        stack: 'total',
        barWidth: CHART_THEME.bar.barWidth,
        barMaxWidth: this.calcularAnchoMaximoBarra(fechas.length),
        barMinWidth: 14,

        data: fechas.map((fecha) => {
          const item = data.find(
            (d) => d.fecha === fecha && (d.turno || 'SIN TURNO') === turno,
          );

          return item ? Number(item.n_frentes || 0) : 0;
        }),

        itemStyle: {
          ...CHART_THEME.bar.itemStyle,
          color: getTurnoColor(turno),
          borderRadius: esUltimaSerie ? [6, 6, 0, 0] : [0, 0, 0, 0],
        },

        label: {
          ...CHART_THEME.bar.label,
          formatter: (params: any) => (params.value > 0 ? params.value : ''),
        },
      };
    });

    const totalesPorFecha = fechas.map((fecha) => {
      return data
        .filter((d) => d.fecha === fecha)
        .reduce((sum, d) => sum + Number(d.n_frentes || 0), 0);
    });

    const maxValor = Math.max(...totalesPorFecha, 1);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    this.chartOptions = {
      color: turnos.map((turno) => getTurnoColor(turno)),

      title: {
        ...CHART_THEME.title,
        text: 'DISPAROS POR DÍA',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        formatter: (params: any) => {
          let fecha = '';
          let total = 0;
          let detalle = '';

          params.forEach((p: any) => {
            if (!fecha) {
              fecha = p.axisValue;
            }

            if (p.value > 0) {
              detalle += `${p.marker} ${p.seriesName}: ${p.value}<br/>`;
              total += Number(p.value);
            }
          });

          return `
            <strong>${fecha}</strong><br/><br/>
            ${detalle}
            <strong>Total: ${total}</strong>
          `;
        },
      },

      legend: {
        ...CHART_THEME.legend,
        data: turnos,
      },

      dataZoom: [
        {
          ...CHART_THEME.dataZoom.inside,
          start: 0,
          end: calcularZoomInicial(fechas.length, 'fechas'),
        },
        {
          ...CHART_THEME.dataZoom.slider,
          start: 0,
          end: calcularZoomInicial(fechas.length, 'fechas'),
        },
      ],

      grid: {
        ...CHART_THEME.grid,
        bottom: 80,
      },

      xAxis: {
        ...CHART_THEME.xAxisCategory,
        data: xAxisData,
      },

      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Cantidad de Disparos',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: yAxisMax,
        interval: this.calcularIntervalo(yAxisMax),
      },

      series,
    };
  }

  private construirSimpleBars(data: DisparosDiaItem[]): void {
    const xAxisData = data.map((item) => this.formatearFecha(item.fecha));
    const seriesData = data.map((item) => Number(item.n_frentes || 0));

    const maxValor = Math.max(...seriesData, 1);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    this.chartOptions = {
      color: [CHART_THEME.colors.primary],

      title: {
        ...CHART_THEME.title,
        text: 'DISPAROS POR DÍA',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          if (!params || params.length === 0) return '';
          const p = params[0];
          return `
            <strong>${p.axisValue}</strong><br/>
            ${p.marker} Disparos: <strong>${p.value}</strong>
          `;
        },
      },

      grid: {
        ...CHART_THEME.grid,
      },

      xAxis: {
        ...CHART_THEME.xAxisCategory,
        data: xAxisData,
      },

      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Cantidad de Disparos',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: yAxisMax,
        interval: this.calcularIntervalo(yAxisMax),
      },

      series: [
        {
          type: 'bar',
          data: seriesData,
          barWidth: CHART_THEME.bar.barWidth,
          barMaxWidth: this.calcularAnchoMaximoBarra(data.length),
          barMinWidth: 14,
          itemStyle: {
            ...CHART_THEME.bar.itemStyle,
            color: CHART_THEME.colors.primary,
            borderRadius: [6, 6, 0, 0],
          },
          label: {
            ...CHART_THEME.bar.label,
            formatter: (params: any) => (params.value > 0 ? params.value : ''),
          },
        },
      ],
    };
  }

  private normalizeData(data: DisparosDiaItem[]): DisparosDiaItem[] {
    return (data || []).filter(
      (item) => item && typeof item.fecha === 'string' && item.fecha !== '',
    );
  }

  formatearFecha(fechaStr: string): string {
    if (!fechaStr) return '';

    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);

    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    return `${fecha.getDate()} ${meses[fecha.getMonth()]}`;
  }

  private calcularAnchoMaximoBarra(cantidadFechas: number): number {
    if (cantidadFechas <= 1) return 55;
    if (cantidadFechas <= 3) return 55;
    if (cantidadFechas <= 7) return 55;
    if (cantidadFechas <= 15) return 55;

    return 60;
  }

  calcularIntervalo(max: number): number {
    if (max <= 5) return 1;
    if (max <= 10) return 2;
    if (max <= 20) return 5;
    if (max <= 50) return 10;
    return 20;
  }

  private ordenTurno(turno: string): number {
    const valor = String(turno || '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();

    if (valor === 'DIA') return 1;
    if (valor === 'NOCHE') return 2;
    return 99;
  }
}
