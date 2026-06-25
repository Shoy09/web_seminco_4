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

export interface MetrosPerforadosDisparoItem {
  modelo_equipo: string;
  seccion: string;
  n_frentes: number;
  metros_perforados: number;
  m_disparo_fr: number;
}

@Component({
  selector: 'app-metros-perforados-disparo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './metros-perforados-disparo.component.html',
  styleUrl: './metros-perforados-disparo.component.css',
})
export class MetrosPerforadosDisparoComponent implements OnChanges {
  @Input() data: MetrosPerforadosDisparoItem[] = [];
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

  getChartTitle(): string {
    return 'METROS PERFORADOS/DISPARO';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChart();
    }
  }

  updateChart(): void {
    const normalizedData = this.normalizeData(this.data);

    if (normalizedData.length === 0) {
      this.chartOptions = {};
      return;
    }

    const xAxisData = normalizedData.map(
      (item) => `${item.modelo_equipo || 'N/A'} (${item.seccion || 'N/A'})`,
    );

    const seriesData = normalizedData.map((item) =>
      Number(item.m_disparo_fr || 0),
    );

    const zoomEnd = calcularZoomInicial(xAxisData.length, 'categorias');

    this.chartOptions = {
      color: [CHART_THEME.colors.primary],

      title: {
        ...CHART_THEME.title,
        text: 'METROS PERFORADOS/DISPARO',
        textStyle: {
          ...CHART_THEME.title.textStyle,
          fontSize: 14,
        },
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        formatter: (params: any) => {
          const param = params[0];
          const item = normalizedData[param.dataIndex];

          return `
            <strong>${item.modelo_equipo || 'N/A'} (${item.seccion || 'N/A'})</strong><br/><br/>
            ${param.marker} Metros/Disparo:
            <strong>${Number(param.value || 0).toFixed(2)} m</strong>
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
          name: 'Metros/Disparo',
          type: 'bar',
          data: seriesData,

          barWidth: CHART_THEME.bar.barWidth,
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
            formatter: (params: any) =>
              `${Math.round(Number(params.value || 0))} m`,
            fontWeight: 'bold',
            fontSize: 12,
          },
        },
      ],
    };
  }

  private normalizeData(
    data: MetrosPerforadosDisparoItem[],
  ): MetrosPerforadosDisparoItem[] {
    return (data || []).filter(
      (item) =>
        item &&
        typeof item.modelo_equipo === 'string' &&
        item.modelo_equipo !== '',
    );
  }
}
