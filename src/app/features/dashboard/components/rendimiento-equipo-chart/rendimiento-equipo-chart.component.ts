import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';
import {
  calcularZoomInicial,
  CHART_THEME,
} from '../../../../config/chart-theme';
import {
  exportarImagenChart,
  PdfExportOptions,
} from '../../../../config/config-pdf';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export interface RendimientoEquipoChartItem {
  modeloEquipo: string;
  seccion?: string;
  DM_FR: number;
  UTI_FR: number;
}

type LegacyRendimientoEquipoItem = Record<string, any>;

@Component({
  selector: 'app-rendimiento-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './rendimiento-equipo-chart.component.html',
  styleUrl: './rendimiento-equipo-chart.component.css',
})
export class RendimientoEquipoChartComponent implements OnChanges {
  @Input() data: Array<
    RendimientoEquipoChartItem | LegacyRendimientoEquipoItem
  > = [];

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
    const normalizedData = this.normalizeData(this.data);

    if (normalizedData.length === 0) {
      this.chartOptions = {};
      return;
    }

    const categorias = normalizedData.map(
      (item) =>
        `${item.modeloEquipo || 'SIN EQUIPO'} (${item.seccion || 'N/A'})`,
    );

    const dmData = normalizedData.map((item) =>
      Number(((item.DM_FR || 0) * 100).toFixed(2)),
    );

    const utiData = normalizedData.map((item) =>
      Number(((item.UTI_FR || 0) * 100).toFixed(2)),
    );

    const zoomEnd = calcularZoomInicial(categorias.length, 'categorias');

    this.chartOptions = {
      color: [CHART_THEME.colors.primary, CHART_THEME.colors.success],

      title: {
        ...CHART_THEME.title,
        text: 'DM Y UTI POR EQUIPO (%)',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        formatter: (params: any) => {
          let result = `<strong>${params[0].axisValue}</strong><br/><br/>`;

          params.forEach((p: any) => {
            result += `${p.marker} ${p.seriesName}: <strong>${p.value}%</strong><br/>`;
          });

          return result;
        },
      },

      legend: {
        ...CHART_THEME.legend,
        data: ['DM', 'UTI'],
        bottom: 5,
      },

      toolbox: {
        show: true,
        right: 10,
        top: 10,
        feature: {
          saveAsImage: {
            title: 'Descargar',
            name: 'rendimiento-equipo',
          },
          restore: {
            title: 'Restaurar',
          },
        },
      },

      grid: {
        ...CHART_THEME.grid,
        bottom: 80,
      },

      dataZoom:
        categorias.length > 6
          ? [
              {
                ...CHART_THEME.dataZoom.inside,
                start: 0,
                end: zoomEnd,
              },
              {
                ...CHART_THEME.dataZoom.slider,
                start: 0,
                end: zoomEnd,
              },
            ]
          : [],

      xAxis: {
        ...CHART_THEME.xAxisCategory,
        data: categorias,
        axisLabel: {
          ...CHART_THEME.xAxisCategory.axisLabel,
          fontSize: 11,
          lineHeight: 16,
          interval: 0,
          rotate: categorias.length > 8 ? 25 : 0,
        },
      },

      yAxis: {
        ...CHART_THEME.yAxisValue,
        name: 'Porcentaje (%)',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          ...CHART_THEME.yAxisValue.axisLabel,
          formatter: '{value}%',
        },
      },

      series: [
        {
          name: 'DM',
          type: 'bar',
          data: dmData,
          ...CHART_THEME.barDM,
        },
        {
          name: 'UTI',
          type: 'bar',
          data: utiData,
          ...CHART_THEME.barDM,
        },
      ],
    };
  }

  private normalizeData(
    data: Array<RendimientoEquipoChartItem | LegacyRendimientoEquipoItem>,
  ): RendimientoEquipoChartItem[] {
    return (data || []).map((item) => this.normalizeItem(item)).filter(Boolean);
  }

  private normalizeItem(
    item: RendimientoEquipoChartItem | LegacyRendimientoEquipoItem,
  ): RendimientoEquipoChartItem {
    const typedItem = item as RendimientoEquipoChartItem;

    if (typedItem.modeloEquipo !== undefined && typedItem.DM_FR !== undefined) {
      return {
        modeloEquipo: typedItem.modeloEquipo,
        seccion: typedItem.seccion,
        DM_FR: Number(typedItem.DM_FR || 0),
        UTI_FR: Number(typedItem.UTI_FR || 0),
      };
    }

    const legacyItem = item as LegacyRendimientoEquipoItem;
    return {
      modeloEquipo: legacyItem['modelo_equipo'] || 'SIN EQUIPO',
      seccion: legacyItem['seccion'] || 'N/A',
      DM_FR: Number(legacyItem['DM_FR'] || 0),
      UTI_FR: Number(legacyItem['UTI_FR'] || 0),
    };
  }
}
