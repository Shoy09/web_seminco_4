import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

@Component({
  selector: 'app-avance-fase',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './avance-fase.component.html',
  styleUrl: './avance-fase.component.css'
})
export class AvanceFaseComponent implements OnChanges {

  @Input() data: any[] = []; // 🔥 viene del padre

  chartOptions: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data?.length) {
      this.generarGrafico();
    }
  }

  // =========================================
  // 🔥 AGRUPAR POR AREA + SUMAR METROS
  // =========================================
  generarGrafico() {
    const agrupado: { [key: string]: number } = {};

    this.data.forEach(item => {
      const area = item.area || 'SIN AREA';
      const metros = Number(item.metros) || 0;

      if (!agrupado[area]) {
        agrupado[area] = 0;
      }

      agrupado[area] += metros;
    });

    // 🔥 convertir a formato echarts
    const dataGrafico = Object.keys(agrupado).map(area => ({
      name: area,
      value: Number(agrupado[area].toFixed(2))
    }));

    console.log('🔥 DATA GRAFICO PIE:', dataGrafico);

    // =========================================
    // 🔥 OPCIONES DEL GRAFICO
    // =========================================
    this.chartOptions = {
      title: {
        text: 'METROS PERFORADOS POR ÁREA',
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} m ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Metros',
          type: 'pie',
          radius: '70%',
          data: dataGrafico,
          label: {
            show: true,
            formatter: '{b}\n{c} m',
            fontSize: 12
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          }
        }
      ]
    };
  }
}