import { Component } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent, CanvasRenderer]);

@Component({
  selector: 'app-horas-inicio-perforacion',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './horas-inicio-perforacion.component.html',
  styleUrl: './horas-inicio-perforacion.component.css'
})
export class HorasInicioPerforacionComponent {
  // Convertir horas a formato numérico para el gráfico
  // 10:30 = 10.5, 13:30 = 13.5, 11:50 = 11.833
  getHoraNumerica(horaStr: string): number {
    const [hora, minuto] = horaStr.split(':');
    return parseInt(hora) + (parseInt(minuto) / 60);
  }

  // Formatear hora numérica a string
  formatearHora(horaNum: number): string {
    const hora = Math.floor(horaNum);
    const minuto = Math.round((horaNum - hora) * 60);
    return `${hora}:${minuto.toString().padStart(2, '0')}`;
  }

  chartOptions: any = {
    title: {
      text: 'Horas de Inicio de Perforación Turno DIA',
      left: 'center',
      top: 10,
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
        const horaNum = params[0].value;
        const horaFormateada = this.formatearHora(horaNum);
        return `<strong>${params[0].axisValue}</strong><br/>Hora de Inicio: ${horaFormateada}`;
      }
    },
    grid: {
      left: '10%',
      right: '8%',
      top: '18%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['J-19', 'J-20', 'J-23'],
      axisLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      },
      axisLine: {
        lineStyle: {
          color: '#333',
          width: 2
        }
      },
      axisTick: {
        show: true,
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      name: 'Hora del Día',
      nameLocation: 'middle',
      nameGap: 45,
      min: 8,
      max: 16,
      interval: 1,
      axisLabel: {
        fontSize: 11,
        formatter: (value: number) => {
          return this.formatearHora(value);
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ccc'
        }
      },
      axisLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Hora de Inicio',
        type: 'line',
        data: [
          this.getHoraNumerica('10:30'),  // J-19: 10:30
          this.getHoraNumerica('13:30'),  // J-20: 13:30
          this.getHoraNumerica('11:50')   // J-23: 11:50
        ],
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          color: '#3498db',
          width: 3,
          type: 'solid',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 5
        },
        itemStyle: {
          color: '#2980b9',
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            const horaFormateada = this.formatearHora(params.value);
            return horaFormateada;
          },
          fontWeight: 'bold',
          fontSize: 12,
          color: '#2980b9',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: [4, 8, 4, 8],
          borderRadius: 4,
          borderColor: '#3498db',
          borderWidth: 1
        },
        smooth: false,
        connectNulls: false,
        areaStyle: {
          opacity: 0.1,
          color: '#3498db'
        },
        markPoint: {
          data: [
            { type: 'min', name: 'Más temprano' },
            { type: 'max', name: 'Más tarde' }
          ],
          symbolSize: 40,
          label: {
            formatter: (params: any) => {
              const hora = this.formatearHora(params.value);
              return params.name === 'Más temprano' ? `🔵 ${hora}` : `🔴 ${hora}`;
            }
          }
        },
        markLine: {
          data: [
            { 
              type: 'average', 
              name: 'Promedio',
              lineStyle: {
                color: '#e74c3c',
                width: 2,
                type: 'dashed'
              },
              label: {
                formatter: (params: any) => {
                  const hora = this.formatearHora(params.value);
                  return `Promedio: ${hora}`;
                }
              }
            }
          ]
        }
      }
    ]
  };
}