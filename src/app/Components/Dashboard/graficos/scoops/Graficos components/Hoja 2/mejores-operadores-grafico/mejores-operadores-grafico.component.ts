import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';
import {
  exportarImagenChart,
  PdfExportOptions,
} from '../../../../../../../config/config-pdf';
import {
  calcularZoomInicial,
  CHART_LINE_STYLE,
  CHART_THEME,
} from '../../../../../../../config/chart-theme';

echarts.use([
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export interface MejorOperadorGraficoItem {
  operador: string;
  turno: string;
  Tonelaje: number;
  HorasOperativo: number;
  TnxHr: number;
}

@Component({
  selector: 'app-mejores-operadores-grafico',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './mejores-operadores-grafico.component.html',
  styleUrl: './mejores-operadores-grafico.component.css',
})
export class MejoresOperadoresGraficoComponent implements OnChanges {
  @Input() data: MejorOperadorGraficoItem[] = [];

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

  private formatearNombre(nombre: string): string {
    if (!nombre || nombre === 'N/A') return 'N/A';
    const partes = nombre.split(' ');
    if (partes.length === 1) return nombre;
    const [a, b, ...resto] = partes;
    const linea2 = resto.length ? resto.join(' ') : b;
    return `${a}\n${linea2}`;
  }

  private updateChart(): void {
    if (!this.data || !this.data.length) {
      this.chartOptions = {};
      return;
    }

    const sorted = [...this.data]
      .sort((a, b) => Number(b.Tonelaje ?? 0) - Number(a.Tonelaje ?? 0))
      .slice(0, 10);

    const operadores = sorted.map((item) =>
      this.formatearNombre(item.operador || 'N/A'),
    );
    const tonelajes = sorted.map((item) => Number(item.Tonelaje ?? 0));
    const tnHr = sorted.map((item) => Number(item.TnxHr ?? 0));

    const maxTonn = Math.max(...tonelajes, 1);
    const yMax = maxTonn * 1.2;

    const maxTnHr = Math.max(...tnHr, 1);
    const scaleFactor = yMax / maxTnHr;
    const tnHrScaled = tnHr.map((v) => v * scaleFactor);

    this.chartOptions = {
      title: {
        ...CHART_THEME.title,
        text: 'MEJORES OPERADORES',
      },
      tooltip: {
        ...CHART_THEME.tooltip,
        formatter: (params: any) => {
          const item = sorted[params[0].dataIndex];
          if (!item) return '';
          let result = `<strong>${item.operador}</strong><br/>`;
          params.forEach((p: any) => {
            if (p.seriesName === 'Tonelaje') {
              result += `${p.marker} ${p.seriesName}: <strong>${tonelajes[p.dataIndex].toFixed(0)}</strong><br/>`;
            } else if (p.seriesName === 'Tn/Hr') {
              result += `${p.marker} ${p.seriesName}: <strong>${tnHr[p.dataIndex].toFixed(1)}</strong><br/>`;
            }
          });
          return result;
        },
      },
      legend: {
        ...CHART_THEME.legend,
        data: ['Tonelaje', 'Tn/Hr'],
      },
      grid: {
        ...CHART_THEME.grid,
        top: '18%',
        bottom: '22%',
      },
      dataZoom: [
        {
          ...CHART_THEME.dataZoom.inside,
          start: 0,
          end: 100,
        },
        {
          ...CHART_THEME.dataZoom.slider,
          start: 0,
          end: 100,
        },
      ],
      xAxis: {
        ...CHART_THEME.xAxisCategory,
        data: operadores,
        axisLabel: {
          ...CHART_THEME.xAxisCategory.axisLabel,
          interval: 0,
          fontSize: 10,
          lineHeight: 14,
          rotate: 25,
          margin: 12,
        },
      },
      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Tonelaje',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: yMax,
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          formatter: (v: number) => `${Math.round(v)}`,
        },
      },
      series: [
        {
          name: 'Tonelaje',
          type: 'bar',
          data: tonelajes,
          itemStyle: {
            color: CHART_THEME.colors.primaryScale3[0],
            borderRadius: [6, 6, 0, 0],
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowBlur: 5,
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => `${Math.round(params.value)}`,
            fontWeight: 'bold',
            fontSize: 11,
            color: CHART_THEME.colors.primaryScale3[0],
          },
          barCategoryGap: '30%',
          barGap: '30%',
        },
        {
          name: 'Tn/Hr',
          type: 'line',
          data: tnHrScaled,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            ...CHART_LINE_STYLE.lineStyle,
          },

          itemStyle: {
            ...CHART_LINE_STYLE.itemStyle,
          },
          label: {
            show: true,
            position: 'top',
            offset: [0, -8],
            formatter: (params: any) => `${tnHr[params.dataIndex].toFixed(1)}`,
            fontWeight: 'bold',
            fontSize: 11,
            ...CHART_LINE_STYLE.label,
          },
          zlevel: 1,
          z: 10,
        },
      ],
    };
  }
}
