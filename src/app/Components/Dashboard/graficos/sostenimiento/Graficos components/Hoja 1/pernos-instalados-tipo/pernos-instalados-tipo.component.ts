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
import {
  exportarImagenChart,
  PdfExportOptions,
} from '../../../../../../../config/config-pdf';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
]);

export interface PernosInstaladosTipoItem {
  tipoPernos: string;
  total: number;
}

@Component({
  selector: 'app-pernos-instalados-tipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './pernos-instalados-tipo.component.html',
  styleUrl: './pernos-instalados-tipo.component.css',
})
export class PernosInstaladosTipoComponent implements OnChanges {
  @Input() data: PernosInstaladosTipoItem[] = [];

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

    const agrupado: Record<string, number> = {};

    normalizedData.forEach((item) => {
      const tipo = item.tipoPernos || 'SIN TIPO';
      agrupado[tipo] = (agrupado[tipo] || 0) + item.total;
    });

    const nombres = Object.keys(agrupado);
    const dataGrafico = nombres.map((name) => ({
      name,
      value: agrupado[name],
    }));

    const coloresBase = [
      CHART_THEME.colors.primary,
      CHART_THEME.colors.primary75,
      CHART_THEME.colors.primary50,
      CHART_THEME.colors.primary25,
      CHART_THEME.colors.secondary,
      CHART_THEME.colors.secondary75,
      CHART_THEME.colors.secondary50,
      CHART_THEME.colors.success,
      CHART_THEME.colors.warning,
      CHART_THEME.colors.textMuted,
    ].filter(Boolean);

    const datosConColor = dataGrafico.map((item, index) => ({
      ...item,
      itemStyle: {
        color: coloresBase[index % coloresBase.length],
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2,
      },
    }));

    this.chartOptions = {
      title: {
        ...CHART_THEME.title,
        text: 'PERNOS INSTALADOS',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'item',
        formatter: '{b}: {c} pernos ({d}%)',
      },

      legend: {
        ...CHART_THEME.legend,
        data: nombres,
      },

      series: [
        {
          name: 'Pernos',
          type: 'pie',
          radius: '55%',
          center: ['50%', '55%'],
          data: datosConColor,
          label: {
            show: true,
            formatter: '{b}\n{c} ({d}%)',
            fontSize: 12,
            fontWeight: 'bold',
            color: CHART_THEME.colors.text,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            scale: true,
            scaleSize: 10,
          },
        },
      ],
    };
  }

  private normalizeData(
    data: PernosInstaladosTipoItem[],
  ): PernosInstaladosTipoItem[] {
    return (data || []).filter(
      (item) =>
        item &&
        typeof item.tipoPernos === 'string' &&
        typeof item.total === 'number',
    );
  }
}
