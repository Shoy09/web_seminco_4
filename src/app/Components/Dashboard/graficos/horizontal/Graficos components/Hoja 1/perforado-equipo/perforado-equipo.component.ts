import { Component } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);

@Component({
  selector: 'app-perforado-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './perforado-equipo.component.html',
  styleUrl: './perforado-equipo.component.css'
})
export class PerforadoEquipoComponent {
  chartOptions: any = {
    title: {
      text: 'PERFORADO POR EQUIPO',
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
      formatter: '{b}<br/>Perforado: {c} m'
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
      name: 'Metros',
      nameLocation: 'middle',
      nameGap: 35,
      min: 0,
      axisLabel: {
        fontSize: 11,
        formatter: '{value} m'
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
        name: 'Perforado',
        type: 'bar',
        data: [246, 246, 107],
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: '#2ecc71',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 5
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} m',
          fontWeight: 'bold',
          fontSize: 12,
          color: '#27ae60'
        },
        barWidth: '50%'
      }
    ]
  };
}