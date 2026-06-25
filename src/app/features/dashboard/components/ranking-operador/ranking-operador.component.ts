import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';

import { BarChart, LineChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

import { PdfExportOptions, exportarImagenChart } from '../../../../config/config-pdf';
import {
  CHART_LINE_STYLE,
  CHART_SPLIT_LINE,
  CHART_THEME,
  calcularZoomInicial,
} from '../../../../config/chart-theme';

echarts.use([
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export interface RankingOperadorItem {
  operador: string;
  turno?: string;
  metros_perforados: number;
  dif_percusion?: number;
  fr_mhr_hp: number;
}

@Component({
  selector: 'app-ranking-operador',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './ranking-operador.component.html',
})
export class RankingOperadorComponent implements OnChanges {
  @Input() data: RankingOperadorItem[] = [];

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
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.chartOptions = {};
      return;
    }

    const sortedData = [...this.data].sort(
      (a, b) =>
        Number(b.metros_perforados || 0) - Number(a.metros_perforados || 0),
    );

    const operadores = sortedData.map((item) => item.operador || 'N/A');

    const operadoresFormateados = operadores.map((op) =>
      this.formatearNombreOperador(op),
    );

    const metrosPerforados = sortedData.map((item) =>
      Number(item.metros_perforados || 0),
    );

    const mhrValues = sortedData.map((item) => Number(item.fr_mhr_hp || 0));

    const mostrarZoom = operadoresFormateados.length > 6;
    const zoomEnd = calcularZoomInicial(
      operadoresFormateados.length,
      'categorias',
    );

    const colores = CHART_THEME.colors.primaryScale3;

    this.chartOptions = {
      color: [colores[0], colores[1]],

      title: {
        ...CHART_THEME.title,
        text: 'RANKING OPERADOR',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const index = params[0].dataIndex;
          const operador = operadores[index];

          const metros = metrosPerforados[index].toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          const mhr = mhrValues[index].toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          const barra = params.find((p: any) => p.seriesName === 'Metros');
          const linea = params.find((p: any) => p.seriesName === 'M/HR');

          return `
            <strong>${operador}</strong><br/><br/>
            ${barra?.marker || ''} Metros:
            <strong>${metros} m</strong><br/>
            ${linea?.marker || ''} M/HR:
            <strong>${mhr}</strong>
          `;
        },
      },

      legend: {
        ...CHART_THEME.legend,
        data: ['Metros', 'M/HR'],
      },

      toolbox: {
        show: true,
        right: 10,
        top: 10,
        feature: {
          saveAsImage: {
            title: 'Descargar',
            name: 'ranking-operador',
          },
          restore: {
            title: 'Restaurar',
          },
        },
      },

      grid: {
        ...CHART_THEME.grid,
        left: '8%',
        right: '8%',
        top: '22%',
        bottom: mostrarZoom ? '28%' : '20%',
        containLabel: true,
      },

      dataZoom: mostrarZoom
        ? [
            {
              ...CHART_THEME.dataZoom.inside,
              start: 0,
              end: zoomEnd,
            },
            {
              ...CHART_THEME.dataZoom.slider,
              start: 0,
              end: zoomEnd,
            },
          ]
        : [],

      xAxis: {
        ...CHART_THEME.xAxisCategory,
        data: operadoresFormateados,
        axisLabel: {
          ...CHART_THEME.xAxisCategory.axisLabel,
          interval: 0,
          fontSize: 10,
          lineHeight: 14,
          rotate: operadoresFormateados.length > 10 ? 25 : 0,
          margin: 12,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },

      yAxis: [
        {
          ...CHART_THEME.yAxisValue,
          type: 'value',
          name: 'Metros',
          nameLocation: 'middle',
          nameGap: 55,
          min: 0,
          axisLabel: {
            ...CHART_THEME.yAxisValue.axisLabel,
            formatter: '{value} m',
          },
        },
        {
          ...CHART_THEME.yAxisValue,
          type: 'value',
          name: 'M/HR',
          nameLocation: 'middle',
          nameGap: 45,
          min: 0,
          axisLabel: {
            ...CHART_THEME.yAxisValue.axisLabel,
            formatter: '{value}',
          },
          splitLine: {
            show: false,
          },
        },
      ],

      series: [
        {
          name: 'Metros',
          type: 'bar',
          yAxisIndex: 0,
          data: metrosPerforados,
          barWidth: CHART_THEME.bar.barWidth,
          z: 1,

          itemStyle: {
            ...CHART_THEME.bar.itemStyle,
            color: colores[0],
            borderRadius: [6, 6, 0, 0],
          },

          label: {
            ...CHART_THEME.bar.label,
            show: true,
            position: 'top',
            color: CHART_THEME.colors.secondary,
            fontSize: 11,
            formatter: (params: any) =>
              Number(params.value || 0).toLocaleString('en-US', {
                maximumFractionDigits: 0,
              }),
          },
        },
        {
          name: 'M/HR',
          type: 'line',
          yAxisIndex: 1,
          data: mhrValues,
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          z: 3,

          lineStyle: {
            ...CHART_LINE_STYLE.lineStyle,
          },

          itemStyle: {
            ...CHART_LINE_STYLE.itemStyle,
          },

          label: {
            show: true,
            position: 'top',
            ...CHART_LINE_STYLE.label,
            fontSize: 10,
            fontWeight: 'bold',
            formatter: (params: any) => Number(params.value || 0).toFixed(0),
          },
        },
      ],
    };
  }

  private formatearNombreOperador(nombre: string): string {
    const palabras = String(nombre || 'N/A')
      .trim()
      .split(/\s+/);

    if (palabras.length < 2) {
      return palabras[0] || 'N/A';
    }

    const mitad = Math.ceil(palabras.length / 2);

    return `${palabras.slice(0, mitad).join(' ')}\n${palabras.slice(mitad).join(' ')}`;
  }
}
