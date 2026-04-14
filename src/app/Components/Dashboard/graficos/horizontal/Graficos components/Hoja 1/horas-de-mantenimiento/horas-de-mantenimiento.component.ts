import { Component } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, CanvasRenderer]);


@Component({
  selector: 'app-horas-de-mantenimiento',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './horas-de-mantenimiento.component.html',
  styleUrl: './horas-de-mantenimiento.component.css'
})
export class HorasDeMantenimientoComponent {
  // Datos de demoras operativas
  demorasData = {
    actividades: [
      'Ingreso - Salida',
      'Refrigerio',
      'Traslado de equipo',
      'Charla',
      'Traslado al equipo',
      'Instalación de equipo'
    ],
    horas: [1.6, 0.9, 0.6, 0.6, 0.4, 0.4],
    porcentajes: [35.6, 56.3, 70.0, 82.5, 91.9, 100.0]
  };

  // Escalar los porcentajes al rango de las horas (0-2)
  // El máximo de horas es 1.6, usaremos 2 como base
  getScaledPorcentajes() {
    const maxHoras = 2; // Escala máxima del eje Y
    return this.demorasData.porcentajes.map(p => (p / 100) * maxHoras);
  }

  chartOptions: any = {
    title: {
      text: 'Horas de Mantenimiento',
      left: 'center',
      top: 5,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        let result = `<strong>${params[0].axisValue}</strong><br/>`;
        params.forEach((p: any) => {
          if (p.seriesName === 'Duración promedio') {
            result += `${p.marker} ${p.seriesName}: ${p.value} h<br/>`;
          } else {
            const porcentajeOriginal = this.demorasData.porcentajes[p.dataIndex];
            result += `${p.marker} ${p.seriesName}: ${porcentajeOriginal}%<br/>`;
          }
        });
        return result;
      }
    },
    legend: {
      data: ['Duración promedio', 'Porcentaje acumulado'],
      left: 'left',
      top: 40,
      itemWidth: 30,
      itemHeight: 14,
      textStyle: {
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    grid: {
      left: '12%',
      right: '8%',
      top: '18%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: this.demorasData.actividades,
      axisLabel: {
        fontSize: 10,
        fontWeight: '500',
        rotate: 25,
        interval: 0,
        margin: 10
      },
      axisLine: {
        lineStyle: {
          color: '#333'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Duración (horas)',
      nameLocation: 'middle',
      nameGap: 40,
      min: 0,
      max: 2,
      interval: 0.5,
      axisLabel: {
        fontSize: 11,
        formatter: (value: number) => {
          if (value === 0) return '0 h';
          if (value === 0.5) return '0.5 h';
          if (value === 1) return '1.0 h';
          if (value === 1.5) return '1.5 h';
          if (value === 2) return '2.0 h';
          return `${value} h`;
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ccc'
        }
      }
    },
    series: [
      {
        name: 'Duración promedio',
        type: 'bar',
        data: this.demorasData.horas,
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#3498db' },
              { offset: 1, color: '#2980b9' }
            ]
          },
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 5
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => `${params.value} h`,
          fontWeight: 'bold',
          fontSize: 11,
          color: '#2980b9'
        },
        barWidth: '50%'
      },
      {
        name: 'Porcentaje acumulado',
        type: 'line',
        data: this.getScaledPorcentajes(),
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#e74c3c',
          width: 3,
          type: 'solid'
        },
        itemStyle: {
          color: '#e74c3c',
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            const porcentajeOriginal = this.demorasData.porcentajes[params.dataIndex];
            return `${porcentajeOriginal}%`;
          },
          fontWeight: 'bold',
          fontSize: 11,
          color: '#e74c3c',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: [2, 5, 2, 5],
          borderRadius: 3
        },
        smooth: false
      }
    ]
  };
}