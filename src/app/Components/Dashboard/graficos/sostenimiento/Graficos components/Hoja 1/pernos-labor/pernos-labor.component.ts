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
  CHART_THEME,
  calcularZoomInicial,
} from '../../../../../../../config/chart-theme';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export interface PernosLaborItem {
  labor: string;
  seccion: string;
  seccionLabor: string;
  totalPernos: number;
}

@Component({
  selector: 'app-pernos-labor',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './pernos-labor.component.html',
  styleUrl: './pernos-labor.component.css',
})
export class PernosLaborComponent implements OnChanges {
  @Input() data: PernosLaborItem[] = [];

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
    const normalizedData = this.normalizeData(this.data);

    if (normalizedData.length === 0) {
      this.chartOptions = {};
      return;
    }

    const itemsMap = new Map<string, PernosLaborItem>();

    normalizedData.forEach((item) => {
      const key = `${item.labor}|${item.seccion}`;
      if (!itemsMap.has(key)) {
        itemsMap.set(key, { ...item, totalPernos: 0 });
      }
      itemsMap.get(key)!.totalPernos += item.totalPernos;
    });

    let itemsArray = Array.from(itemsMap.values());

    itemsArray.sort((a, b) => {
      if (a.labor !== b.labor) {
        return a.labor.localeCompare(b.labor);
      }
      return a.seccion.localeCompare(b.seccion);
    });

    const xAxisData = itemsArray.map(
      (item) => `${item.labor}\n(${item.seccion})`,
    );

    const seriesData = itemsArray.map((item) => item.totalPernos);

    const maxValor = Math.max(...seriesData, 1);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    this.chartOptions = {
      color: [CHART_THEME.colors.primary],

      title: {
        ...CHART_THEME.title,
        text: 'PERNOS POR LABOR',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const item = itemsArray[params[0].dataIndex];
          if (!item) return '';

          return `<strong>Labor: ${item.labor}</strong><br/>
                  Sección: ${item.seccion || 'N/A'}<br/>
                  Sección Labor: ${item.seccionLabor || 'N/A'}<br/><br/>
                  <strong>Total Pernos: ${item.totalPernos}</strong>`;
        },
      },

      legend: {
        ...CHART_THEME.legend,
      },

      dataZoom: [
        {
          ...CHART_THEME.dataZoom.inside,
          start: 0,
          end: calcularZoomInicial(itemsArray.length, 'categorias'),
        },
        {
          ...CHART_THEME.dataZoom.slider,
          start: 0,
          end: calcularZoomInicial(itemsArray.length, 'categorias'),
        },
      ],

      grid: {
        ...CHART_THEME.grid,
        bottom: 60,
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
        axisTick: {
          alignWithLabel: true,
        },
      },

      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Cantidad de Pernos Instalados',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: yAxisMax,
        interval: this.calcularIntervalo(yAxisMax),
        axisLabel: {
          show: false,
        },
      },

      series: [
        {
          name: 'Total Pernos',
          type: 'bar',
          data: seriesData,
          barWidth: CHART_THEME.bar.barWidth,
          itemStyle: {
            ...CHART_THEME.bar.itemStyle,
            color: CHART_THEME.colors.primary,
            borderRadius: [6, 6, 0, 0],
          },
          label: {
            ...CHART_THEME.bar.label,
            show: true,
            position: 'top',
            color: CHART_THEME.colors.primary,
            fontWeight: 'bold',
            fontSize: 11,
            formatter: (params: any) =>
              params.value > 0 ? params.value : '',
          },
        },
      ],
    };
  }

  private normalizeData(data: PernosLaborItem[]): PernosLaborItem[] {
    return (data || []).filter(
      (item) =>
        item &&
        typeof item.labor === 'string' &&
        typeof item.totalPernos === 'number',
    );
  }

  calcularIntervalo(max: number): number {
    if (max <= 5) return 1;
    if (max <= 10) return 2;
    if (max <= 20) return 5;
    if (max <= 50) return 10;
    return 20;
  }
}
