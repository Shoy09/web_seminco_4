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
import { CHART_THEME } from '../../../../config/chart-theme';
import { exportarImagenChart, PdfExportOptions } from '../../../../config/config-pdf';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
]);

export interface TonelajeEquipoItem {
  modeloEquipo: string;
  seccion: string;
  tonelaje: number;
}

@Component({
  selector: 'app-tonelaje-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './tonelaje-equipo.component.html',
})
export class TonelajeEquipoComponent implements OnChanges {
  @Input() data: TonelajeEquipoItem[] = [];

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

  private updateChart(): void {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.chartOptions = {};
      return;
    }

    const xAxisData = this.data.map(
      (item) => `${item.modeloEquipo}\n(${item.seccion})`,
    );

    const values = this.data.map((item) =>
      Math.round(item.tonelaje * 10) / 10,
    );

    const maxValor = Math.max(...values, 0);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    this.chartOptions = {
      color: CHART_THEME.colors.primaryScale3,
      title: {
        ...CHART_THEME.title,
        text: 'TONELAJE POR EQUIPO',
      },
      tooltip: {
        ...CHART_THEME.tooltip,
        formatter: (params: any) => {
          const item = this.data[params[0].dataIndex];
          if (!item) return '';
          return `<strong>Equipo: ${item.modeloEquipo}</strong><br/>
                  Sección: ${item.seccion}<br/><br/>
                  <strong>Tonelaje: ${item.tonelaje.toFixed(1)} TN</strong>`;
        },
      },
      legend: { show: false },
      grid: {
        ...CHART_THEME.grid,
      },
      xAxis: {
        ...CHART_THEME.xAxisCategory,
        data: xAxisData,
        axisLabel: {
          ...CHART_THEME.xAxisCategory.axisLabel,
          fontSize: 11,
          fontWeight: 'bold',
          interval: 0,
          rotate: 0,
        },
      },
      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Tonelaje (TN)',
        nameLocation: 'middle',
        nameGap: 60,
        min: 0,
        max: yAxisMax,
      },
      series: [
        {
          name: 'Tonelaje',
          type: 'bar',
          barWidth: '50%',
          data: values,
          itemStyle: {
            color: CHART_THEME.colors.primaryScale3[0],
            borderRadius: [6, 6, 0, 0],
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowBlur: 5,
          },
          label: {
            show: true,
            position: 'top',
            fontWeight: 'bold',
            fontSize: 12,
            color: CHART_THEME.colors.primaryScale3[0],
            formatter: (params: any) => {
              const valor = params.value;
              return valor % 1 === 0 ? valor.toString() : valor.toFixed(1);
            },
          },
        },
      ],
    };
  }

}
