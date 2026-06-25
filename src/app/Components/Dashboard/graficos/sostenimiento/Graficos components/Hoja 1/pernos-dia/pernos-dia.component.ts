import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
import {
  calcularZoomInicial,
  CHART_THEME,
  getTurnoColor,
} from '../../../../../../../config/chart-theme';
import { exportarImagenChart, PdfExportOptions } from '../../../../../../../config/config-pdf';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export interface PernosDiaItem {
  fecha: string;
  total_pernos: number;
  turno?: string;
}

@Component({
  selector: 'app-pernos-dia',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './pernos-dia.component.html',
  styleUrl: './pernos-dia.component.css',
})
export class PernosDiaComponent implements OnChanges {
  @Input() data: PernosDiaItem[] = [];

  chartOptions: any = {};
  private chartInstance: any;

  onChartInit(ec: any): void {
    this.chartInstance = ec;
  }

  getChartImage(options?: number | PdfExportOptions): string | null {
    return exportarImagenChart(
      this.chartInstance,
      typeof options === 'number' ? { pixelRatio: options } : options,
    );
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

  private construirStackedBars(data: PernosDiaItem[]): void {
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
        barWidth: 40,

        data: fechas.map((fecha) => {
          const item = data.find(
            (d) => d.fecha === fecha && (d.turno || 'SIN TURNO') === turno,
          );
          return item ? Number(item.total_pernos || 0) : 0;
        }),

        itemStyle: {
          ...CHART_THEME.bar.itemStyle,
          color: getTurnoColor(turno),
          borderRadius: esUltimaSerie ? [6, 6, 0, 0] : [0, 0, 0, 0],
        },

        label: {
          ...CHART_THEME.bar.label,
          show: true,
          position: 'inside',
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: 11,
          formatter: (params: any) => {
            if (params.value === 0) return '';
            return params.value >= 1000
              ? this.formatearNumeroGrande(params.value)
              : params.value.toString();
          },
        },
      };
    });

    const totalesPorFecha = fechas.map((fecha) => {
      return data
        .filter((d) => d.fecha === fecha)
        .reduce((sum, d) => sum + Number(d.total_pernos || 0), 0);
    });

    const maxValor = Math.max(...totalesPorFecha, 1);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    this.chartOptions = {
      color: turnos.map((turno) => getTurnoColor(turno)),

      title: {
        ...CHART_THEME.title,
        text: 'PERNOS POR DÍA',
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
              const valorFormateado =
                p.value >= 1000 ? this.formatearNumeroGrande(p.value) : p.value;
              detalle += `${p.marker} ${p.seriesName}: ${valorFormateado}<br/>`;
              total += Number(p.value);
            }
          });

          const totalFormateado =
            total >= 1000 ? this.formatearNumeroGrande(total) : total;

          return `<strong>${fecha}</strong><br/><br/>
                  ${detalle}
                  <strong>Total: ${totalFormateado}</strong>`;
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
        name: 'Cantidad de Pernos Instalados',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: yAxisMax,
        interval: this.calcularIntervalo(yAxisMax),
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          formatter: (value: number) => {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
            return value.toString();
          },
        },
      },

      series,
    };
  }

  private construirSimpleBars(data: PernosDiaItem[]): void {
    const xAxisData = data.map((item) => this.formatearFecha(item.fecha));
    const seriesData = data.map((item) => Number(item.total_pernos || 0));

    const maxValor = Math.max(...seriesData, 1);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    this.chartOptions = {
      color: [CHART_THEME.colors.primary],

      title: {
        ...CHART_THEME.title,
        text: 'PERNOS POR DÍA',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          if (!params || params.length === 0) return '';
          const p = params[0];
          const valorFormateado =
            p.value >= 1000 ? this.formatearNumeroGrande(p.value) : p.value;
          return `<strong>${p.axisValue}</strong><br/>
                  ${p.marker} Pernos: <strong>${valorFormateado}</strong>`;
        },
      },

      legend: {
        ...CHART_THEME.legend,
      },

      dataZoom: [
        {
          ...CHART_THEME.dataZoom.inside,
          start: 0,
          end: calcularZoomInicial(data.length, 'fechas'),
        },
        {
          ...CHART_THEME.dataZoom.slider,
          start: 0,
          end: calcularZoomInicial(data.length, 'fechas'),
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
        name: 'Cantidad de Pernos Instalados',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: yAxisMax,
        interval: this.calcularIntervalo(yAxisMax),
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          formatter: (value: number) => {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
            return value.toString();
          },
        },
      },

      series: [
        {
          type: 'bar',
          data: seriesData,
          barWidth: 40,
          itemStyle: {
            ...CHART_THEME.bar.itemStyle,
            color: CHART_THEME.colors.primary,
            borderRadius: [6, 6, 0, 0],
          },
          label: {
            ...CHART_THEME.bar.label,
            show: true,
            position: 'inside',
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 11,
            formatter: (params: any) => {
              if (params.value === 0) return '';
              return params.value >= 1000
                ? this.formatearNumeroGrande(params.value)
                : params.value.toString();
            },
          },
        },
      ],
    };
  }

  private normalizeData(data: PernosDiaItem[]): PernosDiaItem[] {
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
    if (max <= 100) return 20;
    if (max <= 500) return 50;
    if (max <= 1000) return 100;
    if (max <= 5000) return 500;
    if (max <= 10000) return 1000;
    if (max <= 50000) return 5000;
    if (max <= 100000) return 10000;
    return 20000;
  }

  formatearNumeroGrande(valor: number): string {
    if (valor >= 1000000) return (valor / 1000000).toFixed(1) + 'M';
    if (valor >= 1000) return (valor / 1000).toFixed(0) + 'K';
    return valor.toString();
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
