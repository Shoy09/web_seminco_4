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
  CHART_TINTS,
} from '../../../../../../../shared/chart-theme';

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
  selector: 'app-horometros-jumbos',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './horometros-jumbos.component.html',
})
export class HorometrosJumbosComponent implements OnChanges {
  @Input() data: any[] = [];

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
      this.updateChart();
    }
  }

  updateChart(): void {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.chartOptions = {};
      return;
    }

    const xAxisData = this.data.map((item) => item.modelo_equipo || 'N/A');

    const dieselData = this.data.map((item) => Number(item.diesel || 0));

    const electricoData = this.data.map((item) => Number(item.electrico || 0));

    const percusionData = this.data.map((item) => Number(item.percusion || 0));

    const allValues = [...dieselData, ...electricoData, ...percusionData];

    const maxValor = Math.max(...allValues, 1);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    const zoomEnd = calcularZoomInicial(xAxisData.length, 'categorias');

    this.chartOptions = {
      color: CHART_THEME.colors.primaryScale3,
      title: {
        ...CHART_THEME.title,
        text: 'HORÓMETROS DE JUMBOS FRONTONEROS',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        formatter: (params: any) => {
          const item = this.data[params[0].dataIndex];

          let result = `
            <strong>${item.modelo_equipo || 'N/A'}</strong><br/><br/>
          `;

          params.forEach((p: any) => {
            const valor = Number(p.value || 0).toFixed(2);
            result += `${p.marker} ${p.seriesName}: <strong>${valor}</strong><br/>`;
          });

          return result;
        },
      },

      legend: {
        ...CHART_THEME.legend,
        data: ['H. Diesel', 'H. Eléctrico', 'H. Percusión'],
      },

      grid: {
        ...CHART_THEME.grid,
        bottom: 80,
      },

      dataZoom: [
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
      ],
      xAxis: {
        ...CHART_THEME.xAxisCategory,
        data: xAxisData,
        axisLabel: {
          ...CHART_THEME.xAxisCategory.axisLabel,
          fontSize: 12,
          fontWeight: 'bold',
          interval: 0,
          rotate: xAxisData.length > 8 ? 25 : 0,
          margin: 10,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },

      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Horas',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: yAxisMax,
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          formatter: '{value}',
        },
      },

      series: [
        {
          name: 'H. Diesel',
          type: 'bar',
          data: dieselData,

          barWidth: '22%',
          barGap: '20%',
          barCategoryGap: '30%',

          itemStyle: {
            ...CHART_THEME.bar.itemStyle,
            color: CHART_THEME.colors.primaryScale3[0],
            borderRadius: [6, 6, 0, 0],
          },

          label: {
            ...CHART_THEME.bar.label,
            show: true,
            position: 'top',
            color: CHART_THEME.colors.primaryScale3[0],
            formatter: (params: any) =>
              `${Number(params.value || 0).toFixed(2)}`,
            fontWeight: 'bold',
            fontSize: 11,
          },
        },
        {
          name: 'H. Eléctrico',
          type: 'bar',
          data: electricoData,

          barWidth: '22%',
          barGap: '20%',
          barCategoryGap: '30%',

          itemStyle: {
            ...CHART_THEME.bar.itemStyle,
            color: CHART_THEME.colors.primaryScale3[1],
            borderRadius: [6, 6, 0, 0],
          },

          label: {
            ...CHART_THEME.bar.label,
            show: true,
            position: 'top',
            color: CHART_THEME.colors.primaryScale3[1],
            formatter: (params: any) =>
              `${Number(params.value || 0).toFixed(2)}`,
            fontWeight: 'bold',
            fontSize: 11,
          },
        },
        {
          name: 'H. Percusión',
          type: 'bar',
          data: percusionData,

          barWidth: '22%',
          barGap: '20%',
          barCategoryGap: '30%',

          itemStyle: {
            ...CHART_THEME.bar.itemStyle,
            color: CHART_THEME.colors.primaryScale3[2],
            borderRadius: [6, 6, 0, 0],
          },

          label: {
            ...CHART_THEME.bar.label,
            show: true,
            position: 'top',
            color: CHART_THEME.colors.primaryScale3[2],
            formatter: (params: any) =>
              `${Number(params.value || 0).toFixed(2)}`,
            fontWeight: 'bold',
            fontSize: 11,
          },
        },
      ],
    };
  }
}
