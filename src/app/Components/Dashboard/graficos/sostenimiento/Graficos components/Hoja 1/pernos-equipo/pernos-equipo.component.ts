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
import {
  exportarImagenChart,
  PdfExportOptions,
} from '../../../../../../../config/config-pdf';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export interface PernosEquipoItem {
  seccion: string;
  modeloEquipo: string;
  tipoPernos: string;
  labor: string;
  totalPernos: number;
}

@Component({
  selector: 'app-pernos-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './pernos-equipo.component.html',
  styleUrl: './pernos-equipo.component.css',
})
export class PernosEquipoComponent implements OnChanges {
  @Input() data: Map<string, PernosEquipoItem> = new Map();

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
      this.actualizarGrafico();
    }
  }

  actualizarGrafico(): void {
    if (!this.data || this.data.size === 0) {
      this.chartOptions = {};
      return;
    }

    const equipos = new Map<
      string,
      {
        modeloEquipo: string;
        tipos: Map<string, number>;
        laborPorTipo: Map<string, Map<string, number>>;
      }
    >();

    for (const item of this.data.values()) {
      if (!equipos.has(item.modeloEquipo)) {
        equipos.set(item.modeloEquipo, {
          modeloEquipo: item.modeloEquipo,
          tipos: new Map(),
          laborPorTipo: new Map(),
        });
      }
      const eq = equipos.get(item.modeloEquipo)!;

      eq.tipos.set(
        item.tipoPernos,
        (eq.tipos.get(item.tipoPernos) || 0) + item.totalPernos,
      );

      if (!eq.laborPorTipo.has(item.tipoPernos)) {
        eq.laborPorTipo.set(item.tipoPernos, new Map());
      }
      const laborMap = eq.laborPorTipo.get(item.tipoPernos)!;
      laborMap.set(
        item.labor,
        (laborMap.get(item.labor) || 0) + item.totalPernos,
      );
    }

    const equiposArray = Array.from(equipos.values()).sort((a, b) =>
      a.modeloEquipo.localeCompare(b.modeloEquipo),
    );

    const xAxisData = equiposArray.map((eq) => eq.modeloEquipo);

    const tiposSet = new Set<string>();
    for (const eq of equiposArray) {
      for (const tipo of eq.tipos.keys()) {
        tiposSet.add(tipo);
      }
    }
    const tiposArray = Array.from(tiposSet);

    const coloresBase = [
      CHART_THEME.colors.primary,
      CHART_THEME.colors.primary75,
      CHART_THEME.colors.primary50,
      CHART_THEME.colors.primary25,
      ...((CHART_THEME.colors as any).primaryScale3 || []),
    ].filter(Boolean);

    const colorPorTipo: Record<string, string> = {};
    tiposArray.forEach((tipo, i) => {
      colorPorTipo[tipo] = coloresBase[i % coloresBase.length];
    });

    const series = tiposArray.map((tipo, tipoIndex) => ({
      name: tipo,
      type: 'bar',
      stack: 'total',
      barWidth: CHART_THEME.bar.barWidth,
      data: equiposArray.map((eq) => eq.tipos.get(tipo) || 0),
      itemStyle: {
        ...CHART_THEME.bar.itemStyle,
        color: colorPorTipo[tipo],
        borderRadius:
          tipoIndex === tiposArray.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0],
      },
      label: {
        ...CHART_THEME.bar.label,
        show: true,
        position: 'inside',
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 11,
        formatter: (params: any) => (params.value > 0 ? params.value : ''),
      },
    }));

    const totales = equiposArray.map((eq) => {
      let sum = 0;
      for (const val of eq.tipos.values()) sum += val;
      return sum;
    });
    const maxValor = Math.max(...totales, 1);
    const yAxisMax = Math.ceil(maxValor * 1.2);

    this.chartOptions = {
      color: tiposArray.map((t) => colorPorTipo[t]),

      title: {
        ...CHART_THEME.title,
        text: 'PERNOS POR EQUIPO',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const eq = equiposArray[params[0].dataIndex];
          if (!eq) return '';

          let total = 0;
          const tipoLines: string[] = [];
          const laborLines: string[] = [];

          params.forEach((p: any) => {
            if (p.value > 0) {
              total += p.value;

              const labs = eq.laborPorTipo.get(p.seriesName);
              if (labs && labs.size > 0) {
                const labDetalle = Array.from(labs.entries())
                  .map(
                    ([lab, cant]) =>
                      `&nbsp;&nbsp;${lab}: <strong>${cant}</strong>`,
                  )
                  .join('<br/>');
                tipoLines.push(
                  `${p.marker} <strong>${p.seriesName}: ${p.value}</strong>`,
                );
                laborLines.push(labDetalle);
              } else {
                tipoLines.push(
                  `${p.marker} ${p.seriesName}: <strong>${p.value}</strong>`,
                );
              }
            }
          });

          let detalle = '';
          for (let i = 0; i < tipoLines.length; i++) {
            detalle += tipoLines[i] + '<br/>';
            detalle += laborLines[i] + '<br/>';
          }

          return `<strong>${eq.modeloEquipo}</strong><br/><br/>
                  ${detalle}
                  <strong>Total: ${total}</strong>`;
        },
      },

      legend: {
        ...CHART_THEME.legend,
        bottom: 0,
        left: 'center',
      },

      dataZoom: [
        {
          ...CHART_THEME.dataZoom.inside,
          start: 0,
          end: calcularZoomInicial(equiposArray.length, 'categorias'),
        },
        {
          ...CHART_THEME.dataZoom.slider,
          start: 0,
          end: calcularZoomInicial(equiposArray.length, 'categorias'),
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
        axisLabel: {
          show: true,
        },
      },

      series,
    };
  }

  calcularIntervalo(max: number): number {
    if (max <= 5) return 1;
    if (max <= 10) return 2;
    if (max <= 20) return 5;
    if (max <= 50) return 10;
    return 20;
  }
}
