import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';

import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer
]);

@Component({
  selector: 'app-promedio-estados-echarts',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './promedio-estados-echarts.component.html',
  styleUrl: './promedio-estados-echarts.component.css'
})
export class PromedioEstadosEchartsComponent implements OnChanges {

  @Input() data: any[] = [];

  chartOptions: any = {};

  coloresPorEstado: any = {
    'OPERATIVO': '#4CAF50',
    'DEMORA': '#FFC107',
    'MANTENIMIENTO': '#F44336',
    'RESERVA': '#FF9800',
    'FUERA DE PLAN': '#2196F3'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      setTimeout(() => {
        this.buildChart();
      }, 0);
    }
  }

  buildChart() {
    if (!this.data || this.data.length === 0) {
      this.chartOptions = this.getOpcionesGrafico([]);
      return;
    }

    // ⏱ Calcular duración
    const datosConDuracion = this.data.map(item => {
      const inicio = this.parseHora(item.hora_inicio).getTime();
      const fin = this.parseHora(item.hora_final).getTime();

      let duracion = (fin - inicio) / (1000 * 60 * 60);
      if (duracion < 0) duracion += 24;

      return { ...item, duracion };
    });

    // 📊 Agrupar por estado
    const sumas: any = {};
    const codigos = new Set<string>();

    datosConDuracion.forEach(d => {
      const estado = (d.estado || '').toUpperCase().trim();
      codigos.add(d.codigoOperacion);
      sumas[estado] = (sumas[estado] || 0) + d.duracion;
    });

    const totalCodigos = codigos.size;
    const estados = Object.keys(sumas);

    // 📉 Calcular promedios
    const dataGrafico = estados.map(estado => ({
      name: estado,
      value: totalCodigos ? +(sumas[estado] / totalCodigos).toFixed(2) : 0
    }));

    this.chartOptions = this.getOpcionesGrafico(dataGrafico);
  }

  getOpcionesGrafico(data: any[]) {
    // Asignar color a cada estado
    const datosConColor = data.map(item => ({
      ...item,
      itemStyle: { color: this.coloresPorEstado[item.name] || '#757575' }
    }));

    return {
      title: {
        text: 'HORAS PROMEDIO POR ESTADO',
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
        formatter: '{b}: {c} horas promedio ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 5,
        left: 'center',
        data: data.map(d => d.name),
        itemWidth: 18,
        itemHeight: 10,
        textStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          color: '#2c3e50'
        }
      },
      series: [
        {
          name: 'Horas Promedio por Estado',
          type: 'pie',
          radius: '55%',
          center: ['50%', '55%'],
          data: datosConColor,
          label: {
            show: true,
            formatter: '{b}\n{c} hrs ({d}%)',
            fontSize: 12,
            fontWeight: 'bold'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            },
            scale: true,
            scaleSize: 10
          },
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      ]
    };
  }

  parseHora(hora: string): Date {
    const [h, m] = (hora || '00:00').split(':').map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  }
}