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
import { CHART_THEME, colorPorRendimiento } from '../../../../config/chart-theme';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
]);

export interface MhrEquipoItem {
  modelo_equipo: string;
  fr_mhr_hp: number;
  metros_perforados?: number;
  dif_percusion?: number;
}

@Component({
  selector: 'app-mhr-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './mhr-equipo.component.html',
  styleUrl: './mhr-equipo.component.css',
})
export class MhrEquipoComponent implements OnChanges {
  @Input() data: MhrEquipoItem[] = [];

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
    if (!this.data || this.data.length === 0) {
      this.chartOptions = {};
      return;
    }

    const xAxisData = this.data.map((item) => `${item.modelo_equipo || 'N/A'}`);

    const seriesData = this.data.map((item) => Number(item.fr_mhr_hp) || 0);

    const maxMH = Math.max(...seriesData);
    const maxY = Math.ceil(maxMH / 20) * 20;

    this.chartOptions = {
      title: {
        text: 'M/HR POR EQUIPO',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const item = this.data[params[0].dataIndex];
          return `<strong>${item.modelo_equipo}</strong><br/>
                  Metros perforados: ${item.metros_perforados?.toFixed(2) || 0} m<br/>
                  Dif. Percusión: ${item.dif_percusion?.toFixed(2) || 0}<br/>
                  <strong>Rendimiento: ${params[0].value.toFixed(2)} m/hr</strong>`;
        },
      },
      grid: {
        ...CHART_THEME.grid,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          fontSize: 11,
          fontWeight: 'bold',
          interval: 0,
          rotate: 0,
        },
        axisLine: {
          lineStyle: {
            color: '#333',
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Metros/Hora',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: maxY,
        interval: maxY / 4,
        axisLabel: {
          fontSize: 10,
          formatter: '{value} m/hr',
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#e0e0e0',
            width: 1,
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: 'M/HR',
          type: 'bar',
          data: seriesData.map((value) => ({
            value: value,
            itemStyle: {
              color: colorPorRendimiento(value),
            },
          })),
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 4,
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => `${Math.round(params.value)}`,
            fontWeight: 'bold',
            fontSize: 11,
            color: '#333',
            offset: [0, 5],
          },
          barWidth: CHART_THEME.bar.barWidth,
          barCategoryGap: '30%',
        },
      ],
    };
  }
}
