import { Component } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);

@Component({
  selector: 'app-disparos-dia',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './disparos-dia.component.html',
  styleUrl: './disparos-dia.component.css'
})
export class DisparosDiaComponent {
  chartOptions: any = {
    title: {
      text: 'DISPAROS POR DÍA',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}<br/>Disparos: {c}'
    },
    grid: {
      left: '10%',
      right: '5%',
      top: '15%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['11 Abril', '12 Abril', '13 Abril', '14 Abril', '15 Abril'],
      axisLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        rotate: 30,  // Rotar etiquetas para mejor visibilidad
      },
      axisLine: {
        lineStyle: {
          color: '#333'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Cantidad de Disparos',
      nameLocation: 'middle',
      nameGap: 40,
      min: 0,
      max: 3,
      interval: 1,
      axisLabel: {
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'DISPAROS',
        type: 'bar',
        data: [1, 0, 2, 1, 0],
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: '#2ecc71',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 5
        },
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold',
          fontSize: 14,
          formatter: '{c}'
        },
        barWidth: '60%'
      }
    ]
  };
}