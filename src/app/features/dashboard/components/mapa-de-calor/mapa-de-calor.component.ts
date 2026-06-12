import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';

import { HeatmapChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  DataZoomComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

import { CHART_THEME } from '../../../../config/chart-theme';

echarts.use([
  HeatmapChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export interface MapaDeCalorItem {
  modelo_equipo: string;
  fecha: string;
  hora_inicio: string;
  hora_decimal: number;
  codigo: string;
}

@Component({
  selector: 'app-mapa-de-calor',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './mapa-de-calor.component.html',
})
export class MapaDeCalorComponent implements OnChanges {
  @Input() data: MapaDeCalorItem[] = [];

  /**
   * Valores esperados:
   * '' | 'DÍA' | 'NOCHE'
   */
  @Input() turno: string = '';

  chartOptions: any = {};

  private chartInstance: any;

  onChartInit(ec: any): void {
    this.chartInstance = ec;
  }

  getChartImage(pixelRatio: number = 2): string | null {
    if (!this.chartInstance) return null;

    return this.chartInstance.getDataURL({
      type: 'jpeg',
      pixelRatio,
      backgroundColor: '#FFFFFF',
      excludeComponents: ['toolbox', 'dataZoom'],
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['turno']) {
      this.actualizarGrafico();
    }
  }

  actualizarGrafico(): void {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.chartOptions = {};
      return;
    }

    const horasTurno = this.obtenerHorasPorTurno();
    const horasLabels = horasTurno.map((hora) => this.formatearHora(hora));

    const equipos = Array.from(
      new Set(
        this.data
          .map((item) => item.modelo_equipo || 'SIN_EQUIPO')
          .filter(Boolean),
      ),
    ).sort();

    const horaIndexMap = new Map<number, number>();
    horasTurno.forEach((hora, index) => {
      horaIndexMap.set(hora, index);
    });

    const equipoIndexMap = new Map<string, number>();
    equipos.forEach((equipo, index) => {
      equipoIndexMap.set(equipo, index);
    });

    const contador = new Map<string, number>();
    const detalleMap = new Map<string, string[]>();

    this.data.forEach((item) => {
      const equipo = item.modelo_equipo || 'SIN_EQUIPO';

      const horaDecimal = this.obtenerHoraDecimal(item);

      if (horaDecimal === null) return;

      const horaBucket = Math.floor(horaDecimal) % 24;

      if (!this.perteneceAlTurno(horaBucket)) return;

      const xIndex = horaIndexMap.get(horaBucket);
      const yIndex = equipoIndexMap.get(equipo);

      if (xIndex === undefined || yIndex === undefined) return;

      const key = `${equipo}|${horaBucket}`;

      contador.set(key, (contador.get(key) || 0) + 1);

      if (!detalleMap.has(key)) {
        detalleMap.set(key, []);
      }

      detalleMap
        .get(key)!
        .push(
          `${item.fecha || 'SIN_FECHA'} - ${item.hora_inicio || ''} - Código ${item.codigo || '-'}`,
        );
    });

    const heatmapData: any[] = [];

    equipos.forEach((equipo, yIndex) => {
      horasTurno.forEach((hora, xIndex) => {
        const key = `${equipo}|${hora}`;
        const value = contador.get(key) || 0;

        heatmapData.push([xIndex, yIndex, value]);
      });
    });

    const maxValue = Math.max(
      ...heatmapData.map((item) => Number(item[2] || 0)),
      1,
    );

    const mostrarZoomEquipos = equipos.length > 10;

    const heatmapColors = [
      CHART_THEME.colors.primary25,
      CHART_THEME.colors.primary50,
      CHART_THEME.colors.primary75,
      CHART_THEME.colors.primary,
    ];

    this.chartOptions = {
      title: {
        ...CHART_THEME.title,
        text: 'MAPA DE CALOR - HORA DE INICIACIÓN POR EQUIPO',
      },

      tooltip: {
        ...CHART_THEME.tooltip,
        trigger: 'item',
        position: 'top',
        formatter: (params: any) => {
          const xIndex = params.value[0];
          const yIndex = params.value[1];
          const cantidad = params.value[2];

          const hora = horasTurno[xIndex];
          const equipo = equipos[yIndex];

          const key = `${equipo}|${hora}`;
          const detalles = detalleMap.get(key) || [];

          const detallesHtml = detalles.length
            ? detalles
                .slice(0, 8)
                .map((d) => `• ${d}`)
                .join('<br/>')
            : 'Sin registros';

          const extra =
            detalles.length > 8
              ? `<br/>+ ${detalles.length - 8} registros más`
              : '';

          return `
            <strong>${equipo}</strong><br/>
            Hora: <strong>${this.formatearHora(hora)}</strong><br/>
            Inicios: <strong>${cantidad}</strong><br/><br/>
            ${detallesHtml}
            ${extra}
          `;
        },
      },

      grid: {
        left: '12%',
        right: mostrarZoomEquipos ? '9%' : '5%',
        top: '18%',
        bottom: 70,
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        data: horasLabels,
        splitArea: {
          show: true,
        },
        axisLabel: {
          ...CHART_THEME.xAxisCategory.axisLabel,
          fontSize: 10,
          fontWeight: 'bold',
          rotate: horasLabels.length > 16 ? 45 : 0,
        },
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: CHART_THEME.colors.text,
          },
        },
      },

      yAxis: {
        type: 'category',
        data: equipos,
        inverse: true,
        splitArea: {
          show: true,
        },
        axisLabel: {
          ...CHART_THEME.xAxisCategory.axisLabel,
          fontSize: 10,
          fontWeight: 'bold',
        },
        axisLine: {
          lineStyle: {
            color: CHART_THEME.colors.text,
          },
        },
      },

      visualMap: {
        min: 0,
        max: maxValue,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 12,
        inRange: {
          color: heatmapColors,
        },
        textStyle: {
          color: CHART_THEME.colors.textMuted,
          fontSize: 10,
        },
      },

      dataZoom: mostrarZoomEquipos
        ? [
            {
              type: 'slider',
              yAxisIndex: 0,
              right: 6,
              top: '22%',
              bottom: 70,
              width: 14,
              start: 0,
              end: 60,
            },
            {
              type: 'inside',
              yAxisIndex: 0,
              start: 0,
              end: 60,
            },
          ]
        : [],

      series: [
        {
          name: 'Inicios',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            color: CHART_THEME.colors.secondary,
            fontSize: 10,
            fontWeight: 'bold',
            formatter: (params: any) => {
              const value = Number(params.value[2] || 0);
              return value > 0 ? value : '';
            },
          },
          itemStyle: {
            borderColor: '#FFFFFF',
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 8,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
            },
          },
        },
      ],
    };
  }

  private obtenerHorasPorTurno(): number[] {
    const turnoNormalizado = this.normalizarTexto(this.turno);

    if (turnoNormalizado === 'DIA') {
      return this.rangoHoras(7, 18);
    }

    if (turnoNormalizado === 'NOCHE') {
      return [...this.rangoHoras(19, 23), ...this.rangoHoras(0, 6)];
    }

    return this.rangoHoras(0, 23);
  }

  private perteneceAlTurno(hora: number): boolean {
    const turnoNormalizado = this.normalizarTexto(this.turno);

    if (turnoNormalizado === 'DIA') {
      return hora >= 7 && hora < 19;
    }

    if (turnoNormalizado === 'NOCHE') {
      return hora >= 19 || hora < 7;
    }

    return true;
  }

  private rangoHoras(inicio: number, fin: number): number[] {
    const horas: number[] = [];

    for (let h = inicio; h <= fin; h++) {
      horas.push(h);
    }

    return horas;
  }

  private formatearHora(hora: number): string {
    return `${String(hora).padStart(2, '0')}:00`;
  }

  private obtenerHoraDecimal(item: MapaDeCalorItem): number | null {
    if (!isNaN(Number(item.hora_decimal))) {
      return Number(item.hora_decimal);
    }

    const horaStr = item.hora_inicio;

    if (!horaStr) return null;

    const partes = String(horaStr).split(':').map(Number);

    const h = partes[0] || 0;
    const m = partes[1] || 0;
    const s = partes[2] || 0;

    return h + m / 60 + s / 3600;
  }

  private normalizarTexto(valor: any): string {
    return String(valor || '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }
}
