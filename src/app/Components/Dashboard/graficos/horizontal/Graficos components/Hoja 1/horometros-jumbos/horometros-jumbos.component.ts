import { Component } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);

@Component({
  selector: 'app-horometros-jumbos',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './horometros-jumbos.component.html',
  styleUrl: './horometros-jumbos.component.css'
})
export class HorometrosJumbosComponent {
  chartOptions: any = {
    title: {
      text: 'HORÓMETROS DE JUMBOS FRONTONEROS',
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
        let result = `<strong>${params[0].axisValue}</strong><br/>`;
        params.forEach((p: any) => {
          result += `${p.marker} ${p.seriesName}: ${p.value} h<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['H. Diesel', 'H. Eléctrico', 'H. Percusión'],
      left: 'center',
      top: 45,
      itemWidth: 30,
      itemHeight: 14,
      textStyle: {
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    grid: {
      left: '10%',
      right: '5%',
      top: '20%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['J-23', 'VII'],
      axisLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      },
      axisLine: {
        lineStyle: {
          color: '#333'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Horas',
      nameLocation: 'middle',
      nameGap: 40,
      min: 0,
      max: 4,
      interval: 1,
      axisLabel: {
        fontSize: 12,
        formatter: '{value} h'
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
        name: 'H. Diesel',
        type: 'bar',
        data: [3.2, 2.3],
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: '#e74c3c',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 5
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} h',
          fontWeight: 'bold',
          fontSize: 12,
          color: '#e74c3c'
        },
        barWidth: '25%'
      },
      {
        name: 'H. Eléctrico',
        type: 'bar',
        data: [1.1, 2.3],
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: '#3498db',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 5
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} h',
          fontWeight: 'bold',
          fontSize: 12,
          color: '#3498db'
        },
        barWidth: '25%'
      },
      {
        name: 'H. Percusión',
        type: 'bar',
        data: [2.3, 1.5],
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: '#2ecc71',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 5
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} h',
          fontWeight: 'bold',
          fontSize: 12,
          color: '#2ecc71'
        },
        barWidth: '25%'
      }
    ]
  };
}