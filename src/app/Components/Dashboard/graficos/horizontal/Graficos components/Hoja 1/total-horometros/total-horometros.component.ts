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
import { CHART_THEME } from '../../../../../../../config/chart-theme';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-total-horometros',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './total-horometros.component.html',
})
export class TotalHorometrosComponent implements OnChanges {
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

    let totalDiesel = 0;
    let totalElectrico = 0;
    let totalPercusion = 0;

    this.data.forEach((item) => {
      totalDiesel += Number(item.diesel || 0);
      totalElectrico += Number(item.electrico || 0);
      totalPercusion += Number(item.percusion || 0);
    });

    const xAxisData = ['Horómetros'];

    const dieselData = [totalDiesel];
    const electricoData = [totalElectrico];
    const percusionData = [totalPercusion];

    const allValues = [totalDiesel, totalElectrico, totalPercusion];

    const maxValor = Math.max(...allValues, 1);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    this.chartOptions = {
      color: CHART_THEME.colors.primaryScale3,

      title: {
        ...CHART_THEME.title,
        text: 'TOTAL HORÓMETROS',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        formatter: (params: any) => {
          let result = `<strong>Totales</strong><br/><br/>`;

          params.forEach((p: any) => {
            const valor = Number(p.value || 0).toFixed(2);

            result += `
              ${p.marker} ${p.seriesName}:
              <strong>${valor} horas</strong><br/>
            `;
          });

          return result;
        },
      },

      legend: {
        ...CHART_THEME.legend,
        data: ['H. Diesel', 'H. Eléctrico', 'H. Percusión'],
        bottom: 5,
        itemWidth: 18,
        itemHeight: 10,
      },

      grid: {
        ...CHART_THEME.grid,
        left: '8%',
        right: '5%',
        top: '20%',
        bottom: '14%',
        containLabel: true,
      },

      xAxis: {
        ...CHART_THEME.xAxisCategory,
        data: xAxisData,
        axisLabel: {
          ...CHART_THEME.xAxisCategory.axisLabel,
          fontSize: 14,
          fontWeight: 'bold',
          interval: 0,
          rotate: 0,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },

      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Horas Totales',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: yAxisMax,
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          formatter: '{value} h',
        },
      },

      series: [
        {
          name: 'H. Diesel',
          type: 'bar',
          data: dieselData,

          barWidth: '25%',
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
              `${Number(params.value || 0).toFixed(2)} h`,
            fontWeight: 'bold',
            fontSize: 12,
          },
        },
        {
          name: 'H. Eléctrico',
          type: 'bar',
          data: electricoData,

          barWidth: '25%',
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
              `${Number(params.value || 0).toFixed(2)} h`,
            fontWeight: 'bold',
            fontSize: 12,
          },
        },
        {
          name: 'H. Percusión',
          type: 'bar',
          data: percusionData,

          barWidth: '25%',
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
              `${Number(params.value || 0).toFixed(2)} h`,
            fontWeight: 'bold',
            fontSize: 12,
          },
        },
      ],
    };
  }
}
