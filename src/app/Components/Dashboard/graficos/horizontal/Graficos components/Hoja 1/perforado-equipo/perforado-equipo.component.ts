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
  selector: 'app-perforado-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './perforado-equipo.component.html',
})
export class PerforadoEquipoComponent implements OnChanges {
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
    console.log(this.data);
    if (changes['data']) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.chartOptions = {};
      return;
    }

    const xAxisData = this.data.map(
      (item) => `${item.modelo_equipo || 'N/A'} (${item.seccion || 'N/A'})`,
    );

    const seriesData = this.data.map((item) =>
      Number(item.metros_perforados || 0),
    );

    const zoomEnd = calcularZoomInicial(xAxisData.length, 'categorias');

    this.chartOptions = {
      color: [CHART_THEME.colors.primary],

      title: {
        ...CHART_THEME.title,
        text: 'PERFORADO POR EQUIPO',
        textStyle: {
          ...CHART_THEME.title.textStyle,
          fontSize: 14,
        },
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        formatter: (params: any) => {
          const param = params[0];
          const item = this.data[param.dataIndex];

          const valor = Number(param.value || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return `
            <strong>${item.modelo_equipo || 'N/A'} (${item.seccion || 'N/A'})</strong><br/><br/>
            ${param.marker} Perforado:
            <strong>${valor} m</strong>
          `;
        },
      },

      legend: {
        ...CHART_THEME.legend,
        show: false,
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
          fontSize: 11,
          fontWeight: 'bold',
          rotate: xAxisData.length > 8 ? 25 : 0,
          interval: 0,
          margin: 10,
          lineHeight: 18,
          formatter: (value: string) => value,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },

      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Metros',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          formatter: '{value} m',
        },
      },

      series: [
        {
          name: 'Perforado',
          type: 'bar',
          data: seriesData,

          barWidth: '40%',
          barCategoryGap: '30%',

          itemStyle: {
            ...CHART_THEME.bar.itemStyle,
            color: CHART_THEME.colors.primary,
            borderRadius: [6, 6, 0, 0],
          },

          label: {
            ...CHART_THEME.bar.label,
            show: true,
            position: 'top',
            color: CHART_THEME.colors.secondary,
            formatter: (params: any) => {
              const valor = Number(params.value || 0).toLocaleString('en-US', {
                maximumFractionDigits: 0,
              });

              return `${valor} m`;
            },
            fontWeight: 'bold',
            fontSize: 12,
          },
        },
      ],
    };
  }
}
