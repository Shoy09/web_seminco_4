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

import { CHART_THEME } from '../../../../../../../shared/chart-theme';

echarts.use([
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-disparos-tipo-perforacion',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './disparos-tipo-perforacion.component.html',
})
export class DisparosTipoPerforacionComponent implements OnChanges {
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
      const tipo = this.normalizarTipo(
        item.tipo || item.tipo_perforacion || 'SIN TIPO',
      );

      const nDisparos =
        Number(item.n_disparos || 0) || Number(item.n_frentes || 0);

      agrupado.set(tipo, (agrupado.get(tipo) || 0) + nDisparos);
    });

    const dataGrafico = Array.from(agrupado.entries())
      .map(([tipo, valor]) => ({
        name: tipo,
        value: Number(valor || 0),
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    if (dataGrafico.length === 0) {
      this.chartOptions = {};
      return;
    }

    this.chartOptions = this.getOpcionesGrafico(dataGrafico);
  }

  getOpcionesGrafico(dataGrafico: any[]): any {
    const colores = CHART_THEME.colors.primaryScale3;

    const datosConColor = dataGrafico.map((item, index) => ({
      ...item,
      itemStyle: {
        color: colores[index % colores.length],
      },
    }));

    return {
      color: colores,

      title: {
        ...CHART_THEME.title,
        text: 'DISPAROS POR TIPO DE PERFORACIÓN',
        top: 10,
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'item',
        formatter: (params: any) => {
          const valor = Number(params.value || 0).toLocaleString('en-US', {
            maximumFractionDigits: 0,
          });

          return `
            <strong>${params.name}</strong><br/><br/>
            ${params.marker} Disparos:
            <strong>${valor}</strong><br/>
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
          name: 'Disparos',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['50%', '48%'],
          data: datosConColor,

          itemStyle: {
            borderRadius: 8,
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
                maximumFractionDigits: 0,
              });

              return `${params.name}\n${valor} (${params.percent}%)`;
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

  private normalizarTipo(valor: any): string {
    return String(valor || 'SIN TIPO')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }
}
