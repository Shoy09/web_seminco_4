import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
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
  ToolboxComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-rendimiento-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './rendimiento-equipo.component.html',
})
export class RendimientoEquipoComponent implements OnChanges {
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
      this.actualizarGrafico();
    }
  }

  actualizarGrafico(): void {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.chartOptions = {};
      return;
    }

    const categorias = this.data.map(
      (item) =>
        `${item.modelo_equipo || 'SIN EQUIPO'} (${item.seccion || 'N/A'})`,
    );

    const dmData = this.data.map((item) =>
      Number(((item.DM_FR || 0) * 100).toFixed(2)),
    );

    const utiData = this.data.map((item) =>
      Number(((item.UTI_FR || 0) * 100).toFixed(2)),
    );

    const zoomEnd = calcularZoomInicial(categorias.length, 'categorias');

    this.chartOptions = {
      color: [CHART_THEME.colors.primary, CHART_THEME.colors.success],

      title: {
        ...CHART_THEME.title,
        text: 'DM Y UTI POR EQUIPO (%)',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        formatter: (params: any) => {
          let result = `<strong>${params[0].axisValue}</strong><br/><br/>`;

          params.forEach((p: any) => {
            result += `${p.marker} ${p.seriesName}: <strong>${p.value}%</strong><br/>`;
          });

          return result;
        },
      },

      legend: {
        ...CHART_THEME.legend,
        data: ['DM', 'UTI'],
        bottom: 5,
      },

      toolbox: {
        show: true,
        right: 10,
        top: 10,
        feature: {
          saveAsImage: {
            title: 'Descargar',
            name: 'rendimiento-equipo',
          },
          restore: {
            title: 'Restaurar',
          },
        },
      },

      grid: {
        ...CHART_THEME.grid,
      },

      dataZoom:
        categorias.length > 6
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
        data: categorias,
        axisLabel: {
          ...CHART_THEME.xAxisCategory.axisLabel,
          fontSize: 11,
          lineHeight: 16,
          interval: 0,
          rotate: categorias.length > 8 ? 25 : 0,
        },
      },

      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Porcentaje (%)',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          formatter: '{value}%',
        },
      },

      series: [
        {
          name: 'DM',
          type: 'bar',
          data: dmData,
          barWidth: CHART_THEME.bar.barWidth,
          barGap: '20%',

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
            formatter: '{c}%',
            fontWeight: 'bold',
          },
        },
        {
          name: 'UTI',
          type: 'bar',
          data: utiData,
          barWidth: CHART_THEME.bar.barWidth,

          itemStyle: {
            ...CHART_THEME.bar.itemStyle,
            color: CHART_THEME.colors.secondary,
            borderRadius: [6, 6, 0, 0],
          },

          label: {
            ...CHART_THEME.bar.label,
            show: true,
            position: 'top',
            color: CHART_THEME.colors.secondary,
            formatter: '{c}%',
            fontWeight: 'bold',
          },
        },
      ],
    };
  }
}
