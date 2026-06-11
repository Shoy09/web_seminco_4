import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-demoras-operativas',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './demoras-operativas.component.html',
  styleUrl: './demoras-operativas.component.css',
})
export class DemorasOperativasComponent implements OnChanges {
  @Input() data: any[] = [];

  chartOptions: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.actualizarGrafico();
    }
  }

  actualizarGrafico(): void {
    if (!this.data || !this.data.length) return;

    // Categorías (Tipo Estado)
    const actividades = this.data.map((item) => item.tipo_estado);

    // Duración promedio (FR_Duración_Estado_Prom)
    const horas = this.data.map((item) => Number(item.promedio.toFixed(1)));

    // % acumulado
    const porcentajes = this.data.map((item) => item.tiempo_acu_pct * 100);

    // 🔹 Calcular maxHoras con EXACTAMENTE 20% de margen
    const maxHorasOriginal = Math.max(...horas, 1);
    const margenSuperior = 0.20; // 20% exacto
    let maxHorasCalculado = maxHorasOriginal * (1 + margenSuperior);
    
    // 🔹 REDONDEAR maxHoras a ENTERO (para evitar decimales en el eje Y)
    let maxHoras = Math.ceil(maxHorasCalculado);
    
    // 🔹 Escalar línea al eje Y (usando el maxHoras redondeado)
    const porcentajesEscalados = porcentajes.map((p) => (p / 100) * maxHoras);

    this.chartOptions = {
      title: {
        text: 'Demoras Operativas',
        left: 'center',
        top: 5,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#2c3e50',
        },
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
        },
      },
      legend: {
        data: ['Duración promedio', 'Porcentaje acumulado'],
        bottom: 0,
        left: 'center',
        orient: 'horizontal',
      },
      grid: {
        left: '3%',
        right: '5%',
        top: '12%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: actividades,
        axisLabel: {
          rotate: 0,
          interval: 0,
          fontSize: 10,
          formatter: (value: string) => {
            const words = value.split(' ');
            const lines = [];
            for (let i = 0; i < Math.min(words.length, 4); i++) {
              lines.push(words[i]);
            }
            let result = lines.join('\n');
            if (words.length > 3) {
              result += '\n...';
            }
            return result;
          },
        },
      },
      yAxis: {
        type: 'value',
        name: 'Duración (horas)',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0,
        max: maxHoras,
        axisLabel: {
          formatter: (value: number) => {
            // 🔹 FORZAR a mostrar solo números enteros en el eje Y
            if (Number.isInteger(value)) {
              return `${value} h`;
            }
            return ''; // No mostrar decimales
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            width: 1,
            color: '#e0e0e0',
          },
        },
        // 🔹 OPCIONAL: Definir intervalos exactos para que solo muestre números enteros
        interval: Math.ceil(maxHoras / 5), // Divide el eje en ~5 partes enteras
      },
      series: [
        {
          name: 'Duración promedio',
          type: 'bar',
          data: horas,
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            color: '#3498db',
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c} h',
            offset: [0, 3],
          },
          barCategoryGap: '30%',
          barGap: '30%',
        },
        {
          name: 'Porcentaje acumulado',
          type: 'line',
          data: porcentajesEscalados,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: '#e74c3c',
            width: 3,
          },
          itemStyle: {
            color: '#e74c3c',
            borderColor: '#ffffff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'top',
            offset: [0, -5],
            formatter: (params: any) =>
              `${porcentajes[params.dataIndex].toFixed(1)}%`,
            fontWeight: 'bold',
            fontSize: 11,
          },
          zlevel: 1,
          z: 10,
        },
      ],
    };
  }
}