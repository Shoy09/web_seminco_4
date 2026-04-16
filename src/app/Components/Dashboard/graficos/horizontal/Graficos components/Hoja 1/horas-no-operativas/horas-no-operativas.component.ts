import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';


@Component({
  selector: 'app-horas-no-operativas',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './horas-no-operativas.component.html',
  styleUrl: './horas-no-operativas.component.css'
})
export class HorasNoOperativasComponent implements OnChanges {

  @Input() data: any[] = [];

  chartOptions: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      //console.log('📊 DEMORAS OPERATIVAS RECIBIDAS:', this.data);
      this.actualizarGrafico();
    }
  }

  actualizarGrafico(): void {
    if (!this.data || !this.data.length) return;

    // 🔹 Categorías (Tipo Estado)
    const actividades = this.data.map(item => item.tipo_estado);

    // 🔹 Duración promedio (FR_Duración_Estado_Prom)
    const horas = this.data.map(item => Number(item.promedio.toFixed(1)));

    // 🔹 % acumulado
    const porcentajes = this.data.map(item => item.tiempo_acu_pct * 100);

    // 🔹 Escalar línea al eje Y
    const maxHoras = Math.max(...horas, 1);
    const porcentajesEscalados = porcentajes.map(p => (p / 100) * maxHoras);

    this.chartOptions = {
      title: {
        text: 'Horas no operativas',
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
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          let result = `<strong>${params[0].axisValue}</strong><br/>`;
          params.forEach((p: any) => {
            if (p.seriesName === 'Duración promedio') {
              result += `${p.marker} ${p.seriesName}: ${p.value} h<br/>`;
            } else {
              const porcentajeOriginal = porcentajes[p.dataIndex];
              result += `${p.marker} ${p.seriesName}: ${porcentajeOriginal.toFixed(1)}%<br/>`;
            }
          });
          return result;
        }
      },
      legend: {
        data: ['Duración promedio', 'Porcentaje acumulado'],
        left: 'left',
        top: 40
      },
      grid: {
        left: '12%',
        right: '8%',
        top: '18%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
  type: 'category',
  data: actividades,
  axisLabel: {
    rotate: 0, // 👈 importante: sin rotación si quieres vertical
    interval: 0,
    fontSize: 10,
    formatter: (value: string) => {
      const words = value.split(' ');

      // máximo 3 líneas
      const lines = [];
      for (let i = 0; i < Math.min(words.length, 4); i++) {
        lines.push(words[i]);
      }

      let result = lines.join('\n');

      // si hay más palabras -> puntos suspensivos
      if (words.length > 3) {
        result += '\n...';
      }

      return result;
    }
  }
},
      yAxis: {
  type: 'value',
  name: 'Duración (horas)',   // 👈 AÑADIR ESTO BIEN CONFIGURADO
  nameLocation: 'middle',
  nameGap: 45,

  min: 0,
  max: maxHoras,

  axisLabel: {
    formatter: '{value} h'
  }
},
      series: [
        {
          name: 'Duración promedio',
          type: 'bar',
          data: horas,
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            color: '#3498db'
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c} h'
          }
        },
        {
          name: 'Porcentaje acumulado',
          type: 'line',
          data: porcentajesEscalados,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: '#e74c3c',
            width: 3
          },
          itemStyle: {
            color: '#e74c3c'
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => `${porcentajes[params.dataIndex].toFixed(1)}%`
          }
        }
      ]
    };
  }
}