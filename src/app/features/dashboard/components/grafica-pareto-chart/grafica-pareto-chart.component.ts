import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';

import { BarChart, LineChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  LegendComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';
import {
  CHART_AXIS_LABEL,
  CHART_BAR_SHADOW,
  CHART_COLORS,
  CHART_SPLIT_LINE,
  CHART_THEME,
  CHART_TITLE_STYLE,
} from '../../../../config/chart-theme';
import {
  exportarImagenChart,
  PdfExportOptions,
} from '../../../../config/config-pdf';

echarts.use([
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  LegendComponent,
  CanvasRenderer,
]);

export interface ParetoChartItem {
  actividad: string;
  horasDemora: number;
  paretoAct: number;
  porcentajeHoras: number;
  totalHorasDemora: number;
  cantidadRegistros: number;
  codigos: string[];
}

type LegacyParetoItem = Record<string, any>;

@Component({
  selector: 'app-grafica-pareto',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './grafica-pareto-chart.component.html',
  styleUrl: './grafica-pareto-chart.component.css',
})
export class GraficaParetoChartComponent implements OnChanges {
  @Input() data: Array<ParetoChartItem | LegacyParetoItem> = [];
  @Input() titulo: string = 'PARETO';

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

  getChartTitle(): string {
    return this.titulo || 'Gráfico Pareto';
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

    const datosOrdenados = [...normalizedData].sort((a, b) => {
      if (Number(b.horasDemora || 0) !== Number(a.horasDemora || 0)) {
        return Number(b.horasDemora || 0) - Number(a.horasDemora || 0);
      }

      return String(a.actividad || '').localeCompare(String(b.actividad || ''));
    });

    const actividades = datosOrdenados.map(
      (item) => item.actividad || 'SIN ACTIVIDAD',
    );

    const horasDemora = datosOrdenados.map((item) =>
      Number(item.horasDemora || 0),
    );

    const paretoAct = datosOrdenados.map((item) => Number(item.paretoAct || 0));

    const maxHoras = Math.max(...horasDemora, 1);
    const escalaMaxHoras = Math.ceil(maxHoras / 5) * 5;

    const porcentajeVisible =
      actividades.length > 8 ? (8 / actividades.length) * 100 : 100;

    this.chartOptions = {
      title: {
        text: this.titulo,
        left: 'center',
        top: 10,
        textStyle: CHART_TITLE_STYLE,
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const index = params[0].dataIndex;
          const item = datosOrdenados[index];

          const horas = Number(item.horasDemora || 0);
          const pareto = Number(item.paretoAct || 0);
          const porcentajeHoras = Number(item.porcentajeHoras || 0);
          const totalHorasDemora = Number(item.totalHorasDemora || 0);

          return `
            <strong>${item.actividad || 'SIN ACTIVIDAD'}</strong><br/>
            <hr style="margin: 5px 0"/>
            Horas demora: <b>${horas.toFixed(2)} h</b><br/>
            % de horas: ${porcentajeHoras.toFixed(2)}%<br/>
            Pareto acumulado: <b>${pareto.toFixed(2)}%</b><br/>
            Total horas demora: ${totalHorasDemora.toFixed(2)} h<br/>
            Registros: ${item.cantidadRegistros || 0}<br/>
            Códigos: ${(item.codigos || []).join(', ')}
          `;
        },
      },

      grid: {
        ...CHART_THEME.grid,
        bottom: 80,
      },

      xAxis: {
        type: 'category',
        data: actividades,
        axisLabel: {
          interval: 0,
          rotate: 0,
          fontSize: 10,
          fontWeight: 'bold',
          color: CHART_COLORS.grey,
          width: 80,
          overflow: 'break',
        },
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: CHART_COLORS.axis,
          },
        },
      },

      yAxis: [
        {
          type: 'value',
          name: 'Horas demora',
          nameLocation: 'middle',
          nameGap: 45,
          min: 0,
          max: escalaMaxHoras,
          axisLabel: {
            formatter: '{value} h',
            ...CHART_AXIS_LABEL,
          },
          splitLine: CHART_SPLIT_LINE,
        },
        {
          type: 'value',
          name: 'Pareto (%)',
          nameLocation: 'middle',
          nameGap: 45,
          min: 0,
          max: 100,
          interval: 20,
          axisLabel: {
            formatter: '{value}%',
            ...CHART_AXIS_LABEL,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: CHART_COLORS.axis,
            },
          },
        },
      ],

      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: porcentajeVisible,
          height: 18,
          bottom: 25,
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          start: 0,
          end: porcentajeVisible,
        },
      ],

      series: [
        {
          name: 'Horas demora',
          type: 'bar',
          yAxisIndex: 0,
          data: horasDemora.map((valor) => ({
            value: valor,
            itemStyle: {
              color: CHART_THEME.colors.primary,
            },
          })),
          ...CHART_THEME.barPareto,
        },
        {
          name: 'Pareto acumulado',
          type: 'line',
          yAxisIndex: 1,
          data: paretoAct,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: CHART_THEME.pareto.line,
          },
          itemStyle: {
            color: CHART_THEME.pareto.symbol,
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              return `${Number(params.value).toFixed(1)}%`;
            },
            fontSize: 10,
            fontWeight: 'bold',
            color: CHART_COLORS.grey,
          },
        },
      ],
    };
  }

  private normalizeData(
    data: Array<ParetoChartItem | LegacyParetoItem>,
  ): ParetoChartItem[] {
    return (data || []).map((item) => this.normalizeItem(item)).filter(Boolean);
  }

  private normalizeItem(
    item: ParetoChartItem | LegacyParetoItem,
  ): ParetoChartItem {
    const typedItem = item as ParetoChartItem;

    if (
      typedItem.actividad !== undefined &&
      typedItem.horasDemora !== undefined
    ) {
      return {
        actividad: typedItem.actividad,
        horasDemora: Number(typedItem.horasDemora || 0),
        paretoAct: Number(typedItem.paretoAct || 0),
        porcentajeHoras: Number(typedItem.porcentajeHoras || 0),
        totalHorasDemora: Number(typedItem.totalHorasDemora || 0),
        cantidadRegistros: Number(typedItem.cantidadRegistros || 0),
        codigos: Array.isArray(typedItem.codigos) ? typedItem.codigos : [],
      };
    }

    const legacyItem = item as LegacyParetoItem;
    return {
      actividad: legacyItem['actividad'] || 'SIN ACTIVIDAD',
      horasDemora: Number(legacyItem['horasDemora'] || 0),
      paretoAct: Number(legacyItem['paretoAct'] || 0),
      porcentajeHoras: Number(legacyItem['porcentajeHoras'] || 0),
      totalHorasDemora: Number(legacyItem['totalHorasDemora'] || 0),
      cantidadRegistros: Number(legacyItem['cantidadRegistros'] || 0),
      codigos: Array.isArray(legacyItem['codigos'])
        ? legacyItem['codigos']
        : [],
    };
  }
}
