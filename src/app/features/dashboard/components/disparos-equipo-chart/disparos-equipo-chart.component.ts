import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import { CHART_THEME } from '../../../../config/chart-theme';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GraphicComponent,
  CanvasRenderer,
]);

export interface DisparosEquipoSegmento {
  tipo: string;
  valor: number;
}

export interface DisparosEquipoChartItem {
  modeloEquipo: string;
  seccion?: string;
  seccionLabor?: string;
  totalDisparos: number;
  segmentos: DisparosEquipoSegmento[];
}

@Component({
  selector: 'app-disparos-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './disparos-equipo-chart.component.html',
  styleUrl: './disparos-equipo-chart.component.css',
})
export class DisparosEquipoChartComponent implements OnChanges {
  @Input() data: DisparosEquipoChartItem[] = [];

  chartOptions: any = {};
  private chartInstance: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.actualizarGrafico();
    }
  }

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

  actualizarGrafico(): void {
    const normalizedData = this.normalizeData(this.data);

    if (normalizedData.length === 0) {
      this.chartOptions = {};
      return;
    }

    const tiposArray = Array.from(
      new Set(normalizedData.flatMap((item) => item.segmentos.map((segmento) => segmento.tipo))),
    );

    const xAxisData = normalizedData.map(
      (item) => `${item.modeloEquipo || 'N/A'} (${item.seccion || 'N/A'})`,
    );

    const coloresPorTipo = this.obtenerColoresPorTipo(tiposArray);

    const series = tiposArray.map((tipo, tipoIndex) => ({
      name: tipo,
      type: 'bar',
      stack: 'total',
      barWidth: CHART_THEME.bar.barWidth,
      data: normalizedData.map((item) => this.getSegmentValue(item, tipo)),
      itemStyle: {
        ...CHART_THEME.bar.itemStyle,
        color: coloresPorTipo[tipo],
        borderRadius:
          tipoIndex === tiposArray.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0],
      },
      label: {
        ...CHART_THEME.bar.label,
        show: true,
        position: 'inside',
        color: CHART_THEME.colors.secondary,
        fontWeight: 'bold',
        fontSize: 11,
        formatter: (params: any) => (params.value > 0 ? params.value : ''),
      },
    }));

    const maxValor = Math.max(...normalizedData.map((item) => item.totalDisparos), 1);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    this.chartOptions = {
      color: tiposArray.map((tipo) => coloresPorTipo[tipo]),
      title: {
        ...CHART_THEME.title,
        text: 'DISPAROS POR EQUIPO',
      },
      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const item = normalizedData[params[0].dataIndex];

          if (!item) return '';

          const detalle = params
            .filter((param: any) => param.value > 0)
            .map(
              (param: any) =>
                `${param.marker} ${param.seriesName}: <strong>${param.value}</strong><br/>`,
            )
            .join('');

          return `
            <strong>${item.modeloEquipo || 'N/A'}</strong><br/>
            Sección: <strong>${item.seccion || 'N/A'}</strong><br/>
            Sección Labor: <strong>${item.seccionLabor || 'N/A'}</strong><br/><br/>
            ${detalle}
            <strong>Total: ${item.totalDisparos || 0}</strong>
          `;
        },
      },
      legend: {
        ...CHART_THEME.legend,
        data: tiposArray,
        left: 'center',
        itemWidth: 18,
        itemHeight: 10,
        itemGap: 20,
      },
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
          lineHeight: 16,
          margin: 10,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Cantidad de Disparos',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: yAxisMax,
        interval: this.calcularIntervalo(yAxisMax),
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          fontSize: 12,
          formatter: '{value}',
        },
      },
      series,
    };
  }

  private normalizeData(data: DisparosEquipoChartItem[]): DisparosEquipoChartItem[] {
    return (data || []).filter(
      (item) => item && typeof item.modeloEquipo === 'string',
    );
  }

  private getSegmentValue(item: DisparosEquipoChartItem, tipo: string): number {
    return item.segmentos.find((segmento) => segmento.tipo === tipo)?.valor || 0;
  }

  private obtenerColoresPorTipo(tipos: string[]): Record<string, string> {
    const coloresBase = [
      ...((CHART_THEME.colors as any).primaryScale3 || []),
      (CHART_THEME.colors as any).primary,
      (CHART_THEME.colors as any).secondary,
      (CHART_THEME.colors as any).warning,
      (CHART_THEME.colors as any).success,
      (CHART_THEME.colors as any).textMuted,
    ].filter(Boolean);

    const fallback = '#94A3B8';
    const coloresPorTipo: Record<string, string> = {};

    tipos.forEach((tipo, index) => {
      coloresPorTipo[tipo] = coloresBase[index % coloresBase.length] || fallback;
    });

    return coloresPorTipo;
  }

  private calcularIntervalo(max: number): number {
    if (max <= 5) return 1;
    if (max <= 10) return 2;
    if (max <= 20) return 5;
    if (max <= 50) return 10;

    return 20;
  }
}
