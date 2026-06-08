import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GraphicComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

import { CHART_THEME } from '../../../../../../../shared/chart-theme';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GraphicComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-disparos-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './disparos-equipo.component.html',
})
export class DisparosEquipoComponent implements OnChanges {
  @Input() data: any[] = [];

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
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.chartOptions = {};
      return;
    }

    const gruposPorSeccionLabor = new Map<string, any[]>();

    this.data.forEach((item) => {
      const seccionLabor = item.seccion_labor || 'SIN_SECCION';

      if (!gruposPorSeccionLabor.has(seccionLabor)) {
        gruposPorSeccionLabor.set(seccionLabor, []);
      }

      gruposPorSeccionLabor.get(seccionLabor)!.push(item);
    });

    const tiposSet = new Set<string>();

    this.data.forEach((item) => {
      if (item.tipos) {
        Object.keys(item.tipos).forEach((tipo) => tiposSet.add(tipo));
      }
    });

    const tiposArray = Array.from(tiposSet);

    const xAxisData: string[] = [];
    const tooltipMap = new Map<number, any>();

    let index = 0;

    gruposPorSeccionLabor.forEach((items) => {
      items.forEach((item) => {
        const label = `${item.modelo_equipo || 'N/A'} (${item.seccion || 'N/A'})`;

        xAxisData.push(label);
        tooltipMap.set(index, item);
        index++;
      });
    });

    const coloresPorTipo = this.obtenerColoresPorTipo(tiposArray);

    const series = tiposArray.map((tipo, tipoIndex) => ({
      name: tipo,
      type: 'bar',
      stack: 'total',
      barWidth: CHART_THEME.bar.barWidth,

      data: this.data.map((item) => Number(item.tipos?.[tipo] || 0)),

      itemStyle: {
        ...CHART_THEME.bar.itemStyle,
        color: coloresPorTipo[tipo],
        borderRadius:
          tipoIndex === tiposArray.length - 1
            ? [6, 6, 0, 0]
            : [0, 0, 0, 0],
      },

      label: {
        ...CHART_THEME.bar.label,
        show: true,
        position: 'inside',
        color: CHART_THEME.colors.secondary,
        fontWeight: 'bold',
        fontSize: 11,
        formatter: (params: any) => params.value > 0 ? params.value : '',
      },
    }));

    const totales = this.data.map((item) => Number(item.n_frentes || 0));
    const maxValor = Math.max(...totales, 1);
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
          const item = tooltipMap.get(params[0].dataIndex);

          if (!item) return '';

          let detalle = '';

          params.forEach((p: any) => {
            if (p.value > 0) {
              detalle += `${p.marker} ${p.seriesName}: <strong>${p.value}</strong><br/>`;
            }
          });

          return `
            <strong>${item.modelo_equipo || 'N/A'}</strong><br/>
            Sección: <strong>${item.seccion || 'N/A'}</strong><br/>
            Sección Labor: <strong>${item.seccion_labor || 'N/A'}</strong><br/><br/>
            ${detalle}
            <strong>Total: ${item.n_frentes || 0}</strong>
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

  calcularIntervalo(max: number): number {
    if (max <= 5) return 1;
    if (max <= 10) return 2;
    if (max <= 20) return 5;
    if (max <= 50) return 10;

    return 20;
  }
}