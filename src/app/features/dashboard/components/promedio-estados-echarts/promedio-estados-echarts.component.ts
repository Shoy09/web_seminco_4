import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';

import { PieChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

import { CHART_THEME } from '../../../../config/chart-theme';
import { normalizarTexto } from '../../../../utils/fecha-utils';

echarts.use([
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer
]);

export interface PromedioEstadoItem {
  codigoOperacion: string;
  turno: string;
  estado: string;
  codigoEstado: string;
  tipo_estado: string | null;
  categoria: string | null;
  estado_principal_match: string | null;
  hora_inicio: string;
  hora_final: string;
}

@Component({
  selector: 'app-promedio-estados-echarts',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './promedio-estados-echarts.component.html',
  styleUrl: './promedio-estados-echarts.component.css'
})
export class PromedioEstadosEchartsComponent implements OnChanges {

  @Input() data: PromedioEstadoItem[] = [];

  chartOptions: any = {};

  private tiposPorEstado: Map<string, Map<string, { horas: number; categoria: string | null }>> = new Map();

  private readonly coloresPorEstado: Record<string, string> = {
    OPERATIVO: CHART_THEME.colors.primaryScale3?.[0] || '#38BDF8',
    DEMORA: CHART_THEME.colors.primaryScale3?.[1] || '#6DCCFA',
    MANTENIMIENTO: CHART_THEME.colors.primaryScale3?.[2] || '#9BDBFC',
    RESERVA: CHART_THEME.colors.primaryScale3?.[1] || '#6DCCFA',
    'FUERA DE PLAN': CHART_THEME.colors.primaryScale3?.[0] || '#38BDF8'
  };
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
      this.buildChart();
    }
  }

  buildChart(): void {
    const normalizedData = this.normalizeData(this.data);

    if (normalizedData.length === 0) {
      this.chartOptions = {};
      return;
    }

    this.tiposPorEstado.clear();

    const datosConDuracion = normalizedData.map(item => {
      const inicio = this.parseHora(item.hora_inicio).getTime();
      const fin = this.parseHora(item.hora_final).getTime();

      let duracion = (fin - inicio) / (1000 * 60 * 60);

      if (duracion < 0) {
        duracion += 24;
      }

      return {
        ...item,
        duracion
      };
    });

    const sumas = new Map<string, number>();
    const codigosOperacion = new Set<string>();

    datosConDuracion.forEach(item => {
      const estado = normalizarTexto(item.estado || 'SIN ESTADO');
      const tipoEstado = normalizarTexto(item.tipo_estado || 'SIN TIPO');
      const categoria = item.categoria || null;

      if (item.codigoOperacion) {
        codigosOperacion.add(item.codigoOperacion);
      }

      sumas.set(estado, (sumas.get(estado) || 0) + item.duracion);

      if (!this.tiposPorEstado.has(estado)) {
        this.tiposPorEstado.set(estado, new Map());
      }

      const tiposMap = this.tiposPorEstado.get(estado)!;

      const dataActual = tiposMap.get(tipoEstado) || {
        horas: 0,
        categoria
      };

      dataActual.horas += item.duracion;

      if (!dataActual.categoria && categoria) {
        dataActual.categoria = categoria;
      }

      tiposMap.set(tipoEstado, dataActual);
    });

    const totalCodigos = codigosOperacion.size || 1;

    const dataGrafico = Array.from(sumas.entries())
      .map(([estado, horas]) => ({
        name: estado,
        value: Number((horas / totalCodigos).toFixed(2))
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    if (dataGrafico.length === 0) {
      this.chartOptions = {};
      return;
    }

    this.chartOptions = this.getOpcionesGrafico(dataGrafico);
  }

  private normalizeData(data: PromedioEstadoItem[]): PromedioEstadoItem[] {
    return (data || []).filter(
      (item) => item && typeof item.estado === 'string' && item.estado !== '',
    );
  }

  getOpcionesGrafico(dataGrafico: any[]): any {
    const colores = CHART_THEME.colors.primaryScale3;

    const datosConColor = dataGrafico.map((item, index) => ({
      ...item,
      itemStyle: {
        color:
          this.coloresPorEstado[item.name] ||
          colores[index % colores.length]
      }
    }));

    return {
      color: colores,

      title: {
        ...CHART_THEME.title,
        text: 'HORAS PROMEDIO POR ESTADO',
        top: 10
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0,
        padding: 0,
        enterable: true,
        hideDelay: 300,
        position: (point: any, params: any, dom: any) => {
          const x = point[0] + 20;
          const y = point[1] - 50;

          const tooltipWidth = dom ? dom.clientWidth : 320;
          const windowWidth = typeof window !== 'undefined'
            ? window.innerWidth
            : 1200;

          if (x + tooltipWidth > windowWidth) {
            return [point[0] - tooltipWidth - 20, y];
          }

          return [x, y];
        },
        formatter: (params: any) => {
          const estado = params.name;
          const color =
            this.coloresPorEstado[estado] ||
            CHART_THEME.colors.primaryScale3[0];

          const horasPromedio = Number(params.value || 0).toFixed(2);
          const porcentaje = Number(params.percent || 0).toFixed(1);

          const tiposMap = this.tiposPorEstado.get(estado);

          let tiposHtml = '';

          if (tiposMap && tiposMap.size > 0) {
            const tiposArray = Array.from(tiposMap.entries())
              .map(([tipo, { horas, categoria }]) => ({
                tipo,
                horas: Number(horas || 0).toFixed(2),
                categoria
              }))
              .sort((a, b) => Number(b.horas) - Number(a.horas));

            const itemsHtml = tiposArray.map(item => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;">
                <div style="flex:1;">
                  <span style="display:inline-block;background:${color}20;color:${color};padding:4px 10px;border-radius:14px;font-size:11px;font-weight:700;margin-bottom:4px;">
                    ${item.tipo}
                  </span>
                </div>
                <span style="font-size:12px;font-weight:700;color:${CHART_THEME.colors.secondary};margin-left:12px;">
                  ${item.horas} hrs
                </span>
              </div>
            `).join('');

            const scrollHeight = tiposArray.length > 6 ? '200px' : 'auto';

            tiposHtml = `
              <div style="margin-top:12px;">
                <div style="font-size:11px;font-weight:700;color:${CHART_THEME.colors.textMuted};margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:4px;border-bottom:2px solid ${color};">
                  DESGLOSE POR TIPO DE ESTADO
                </div>

                <div style="max-height:${scrollHeight};overflow-y:auto;padding-right:6px;">
                  ${itemsHtml}
                </div>

                <div style="margin-top:8px;text-align:center;font-size:10px;color:${CHART_THEME.colors.textMuted};padding-top:4px;border-top:1px solid #f0f0f0;">
                  Total tipos: ${tiposArray.length}
                </div>
              </div>
            `;
          }

          return `
            <div style="background:white;border-radius:12px;box-shadow:0 6px 16px rgba(0,0,0,0.15);padding:0;overflow:hidden;min-width:280px;max-width:350px;">
              
              <div style="background:${color};padding:12px 16px;">
                <div style="color:white;font-size:16px;font-weight:800;letter-spacing:0.5px;">
                  ${estado}
                </div>
              </div>

              <div style="padding:16px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px;">
                  
                  <div>
                    <div style="font-size:11px;color:${CHART_THEME.colors.textMuted};">
                      Horas promedio
                    </div>
                    <div style="font-size:22px;font-weight:800;color:${color};">
                      ${horasPromedio}
                    </div>
                  </div>

                  <div>
                    <div style="font-size:11px;color:${CHART_THEME.colors.textMuted};">
                      Porcentaje
                    </div>
                    <div style="font-size:18px;font-weight:800;color:${CHART_THEME.colors.secondary};">
                      ${porcentaje}%
                    </div>
                  </div>

                </div>

                ${tiposHtml}
              </div>
            </div>
          `;
        }
      },

      legend: {
        ...CHART_THEME.legend,
        type: 'scroll',
        orient: 'horizontal',
        bottom: 5,
        left: 'center',
        data: dataGrafico.map(item => item.name),
        itemWidth: 18,
        itemHeight: 10
      },

      series: [
        {
          name: 'Horas Promedio por Estado',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['50%', '48%'],
          data: datosConColor,

          itemStyle: {
            borderRadius: 8,
            borderColor: '#FFFFFF',
            borderWidth: 2
          },

          label: {
            show: true,
            color: CHART_THEME.colors.secondary,
            fontSize: 11,
            fontWeight: 'bold',
            formatter: (params: any) => {
              const valor = Number(params.value || 0).toFixed(2);
              const porcentaje = Number(params.percent || 0).toFixed(1);

              return `${params.name}\n${valor} hrs (${porcentaje}%)`;
            }
          },

          labelLine: {
            show: true,
            length: 12,
            length2: 8
          },

          emphasis: {
            scale: true,
            scaleSize: 8,
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: CHART_THEME.colors.secondary
            }
          }
        }
      ]
    };
  }

  parseHora(hora: string): Date {
    const [h, m] = String(hora || '00:00')
      .split(':')
      .map(Number);

    const fecha = new Date();

    fecha.setHours(h || 0, m || 0, 0, 0);

    return fecha;
  }
}
