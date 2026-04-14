import { Component } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, CanvasRenderer]);

@Component({
  selector: 'app-rendimiento-equipo',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './rendimiento-equipo.component.html',
  styleUrl: './rendimiento-equipo.component.css'
})
export class RendimientoEquipoComponent {
  chartOptions: any = {
    title: {
      text: 'DM y UTI por Equipo (%)',
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
      formatter: function(params: any) {
        return `${params[0].axisValue}<br/>${params[0].seriesName}: ${params[0].value}%<br/>${params[1].seriesName}: ${params[1].value}%`;
      }
    },
    legend: {
      data: ['DM', 'UTI'],
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
      left: '8%',
      right: '5%',
      top: '18%',
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
      name: 'Porcentaje (%)',
      nameLocation: 'middle',
      nameGap: 45,
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: {
        fontSize: 12,
        formatter: '{value}%'
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
        name: 'DM',
        type: 'bar',
        data: [94.2, 85.0],  // J-23: 94.2%, VII: 85.0%
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: '#3498db',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 5
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontWeight: 'bold',
          fontSize: 14,
          color: '#3498db'
        },
        barWidth: '35%'
      },
      {
        name: 'UTI',
        type: 'bar',
        data: [94.2, 85.0],  // Según la imagen, ambos tienen los mismos valores
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: '#2ecc71',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 5
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontWeight: 'bold',
          fontSize: 14,
          color: '#2ecc71'
        },
        barWidth: '35%'
      }
    ]
  };
}