import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

import { CHART_THEME } from '../../../../../../../config/chart-theme';

echarts.use([
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-avance-fase',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './avance-fase.component.html',
})
export class AvanceFaseComponent implements OnChanges {
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
      this.generarGrafico();
    }
  }

  generarGrafico(): void {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.chartOptions = {};
      return;
    }

    const agrupado = new Map<string, number>();

    this.data.forEach((item) => {
      const fase = String(item.fase || 'SIN FASE')
        .trim()
        .toUpperCase();
      const metros = Number(item.metros || 0);

      agrupado.set(fase, (agrupado.get(fase) || 0) + metros);
    });

    const dataGrafico = Array.from(agrupado.entries())
      .map(([fase, metros]) => ({
        name: fase,
        value: Number(metros.toFixed(2)),
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    if (dataGrafico.length === 0) {
      this.chartOptions = {};
      return;
    }

    this.chartOptions = {
      color: CHART_THEME.colors.primaryScale3,

      title: {
        ...CHART_THEME.title,
        text: 'METROS PERFORADOS POR FASE',
        top: 10,
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'item',
        formatter: (params: any) => {
          const valor = Number(params.value || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return `
            <strong>${params.name}</strong><br/><br/>
            ${params.marker} Metros:
            <strong>${valor} m</strong><br/>
            Participación:
            <strong>${params.percent}%</strong>
          `;
        },
      },

      legend: {
        ...CHART_THEME.legend,
        type: 'scroll',
        orient: 'horizontal',
        bottom: 5,
        left: 'center',
        data: dataGrafico.map((item) => item.name),
        itemWidth: 18,
        itemHeight: 10,
      },

      series: [
        {
          name: 'Metros',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['50%', '48%'],
          data: dataGrafico,

          itemStyle: {
            borderRadius: 6,
            borderColor: '#FFFFFF',
            borderWidth: 2,
          },

          label: {
            show: true,
            color: CHART_THEME.colors.secondary,
            fontSize: 11,
            fontWeight: 'bold',
            formatter: (params: any) => {
              const valor = Number(params.value || 0).toLocaleString('en-US', {
                maximumFractionDigits: 1,
              });

              return `${params.name}\n${valor} m`;
            },
          },

          labelLine: {
            show: true,
            length: 12,
            length2: 8,
          },

          emphasis: {
            scale: true,
            scaleSize: 8,
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: CHART_THEME.colors.secondary,
            },
          },
        },
      ],
    };
  }
}
