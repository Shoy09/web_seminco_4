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

export interface TnHrEquipoItem {
  modeloEquipo: string;
  seccion: string;
  tnHr: number;
}

@Component({
  selector: 'app-tn-hr-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './tn-hr-equipo.component.html',
})
export class TnHrEquipoComponent implements OnChanges {
  @Input() data: TnHrEquipoItem[] = [];

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
      Math.round(item.tnHr * 10) / 10,
    );

    const maxValor = Math.max(...values, 0);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    this.chartOptions = {
      color: CHART_THEME.colors.primaryScale3,
      title: {
        ...CHART_THEME.title,
        text: 'Tn/Hr POR EQUIPO',
      },
      tooltip: {
        ...CHART_THEME.tooltip,
        formatter: (params: any) => {
          const item = this.data[params[0].dataIndex];
          if (!item) return '';
          return `<strong>Equipo: ${item.modeloEquipo}</strong><br/>
                  Sección: ${item.seccion}<br/><br/>
                  <strong>Tn/Hr: ${item.tnHr.toFixed(1)} TN/h</strong>`;
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
        name: 'Tn/Hr (TN/h)',
        nameLocation: 'middle',
        nameGap: 60,
        min: 0,
        max: yAxisMax,
        interval: this.calcularIntervalo(yAxisMax),
      },
      series: [
        {
          name: 'Tn/Hr',
          type: 'bar',
          barWidth: '50%',
          data: values,
          itemStyle: {
            color: CHART_THEME.colors.primaryScale3[1],
            borderRadius: [6, 6, 0, 0],
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowBlur: 5,
          },
          label: {
            show: true,
            position: 'top',
            fontWeight: 'bold',
            fontSize: 12,
            color: CHART_THEME.colors.primaryScale3[1],
            formatter: (params: any) => {
              const valor = params.value;
              return valor % 1 === 0 ? valor.toString() : valor.toFixed(1);
            },
          },
        },
      ],
    };
  }

  private calcularIntervalo(max: number): number {
    if (max <= 5) return 1;
    if (max <= 10) return 2;
    if (max <= 20) return 5;
    if (max <= 50) return 10;
    if (max <= 100) return 20;
    if (max <= 200) return 50;
    if (max <= 500) return 100;
    return 200;
  }
}
