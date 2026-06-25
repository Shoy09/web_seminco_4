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
} from '../../../../config/chart-theme';
import { exportarImagenChart, PdfExportOptions } from '../../../../config/config-pdf';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export interface HorometroEquipoItem {
  modelo_equipo: string;
  diesel?: number;
  electrico?: number;
  percusion?: number;
}

@Component({
  selector: 'app-horometros-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './horometros-equipo.component.html',
})
export class HorometrosEquipoComponent implements OnChanges {
  @Input() data: HorometroEquipoItem[] = [];

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
      this.updateChart();
    }
  }

  updateChart(): void {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.chartOptions = {};
      return;
    }

    const xAxisData = this.data.map((item) => item.modelo_equipo || 'N/A');

    const getValues = (field: 'diesel' | 'electrico' | 'percusion'): number[] =>
      this.data.map((item) => Number(item[field] || 0));

    const seriesConfig = [
      { name: 'H. Diesel', field: 'diesel' as const, colorIdx: 0 },
      { name: 'H. Eléctrico', field: 'electrico' as const, colorIdx: 1 },
      { name: 'H. Percusión', field: 'percusion' as const, colorIdx: 2 },
    ].map((s) => ({ ...s, data: getValues(s.field) }))
     .filter((s) => s.data.some((v) => v > 0));

    if (seriesConfig.length === 0) {
      this.chartOptions = {};
      return;
    }

    const allValues = seriesConfig.flatMap((s) => s.data);

    const maxValor = Math.max(...allValues, 1);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    const zoomEnd = calcularZoomInicial(xAxisData.length, 'categorias');

    this.chartOptions = {
      color: CHART_THEME.colors.primaryScale3,
      title: {
        ...CHART_THEME.title,
        text: 'HORÓMETROS POR EQUIPO',
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
        data: seriesConfig.map((s) => s.name),
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

      series: seriesConfig.map((s) => ({
        name: s.name,
        type: 'bar',
        data: s.data,
        barWidth: '22%',
        barGap: '20%',
        barCategoryGap: '30%',
        itemStyle: {
          ...CHART_THEME.bar.itemStyle,
          color: CHART_THEME.colors.primaryScale3[s.colorIdx],
          borderRadius: [6, 6, 0, 0],
        },
        label: {
          ...CHART_THEME.bar.label,
          show: true,
          position: 'top',
          color: CHART_THEME.colors.primaryScale3[s.colorIdx],
          formatter: (params: any) =>
            `${Number(params.value || 0).toFixed(2)}`,
          fontWeight: 'bold',
          fontSize: 11,
        },
      })),
    };
  }
}
