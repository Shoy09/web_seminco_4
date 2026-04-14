import { Component } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);

@Component({
  selector: 'app-mhr-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './mhr-equipo.component.html',
  styleUrl: './mhr-equipo.component.css'
})
export class MhrEquipoComponent {
  chartOptions: any = {
    title: {
      text: 'M/HR POR EQUIPO',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}<br/>Rendimiento: {c} m/hr'
    },
    grid: {
      left: '10%',
      right: '5%',
      top: '20%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['J-23', 'VII', 'Equipo'],
      axisLabel: {
        fontSize: 12,
        fontWeight: 'bold'
      },
      axisLine: {
        lineStyle: {
          color: '#333'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Metros/Hora',
      nameLocation: 'middle',
      nameGap: 35,
      min: 0,
      axisLabel: {
        fontSize: 11,
        formatter: '{value} m/hr'
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
        name: 'M/HR',
        type: 'bar',
        data: [246, 246, 107],
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: '#e74c3c',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 5
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} m/hr',
          fontWeight: 'bold',
          fontSize: 12,
          color: '#c0392b'
        },
        barWidth: '50%'
      }
    ]
  };
}