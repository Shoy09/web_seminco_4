import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import * as echarts from 'echarts/core';

import { BarChart, LineChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-monitoreo-scoops',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    NgxEchartsDirective,

    ButtonModule,
    SelectModule,
    InputTextModule,
    DialogModule,
    TableModule,
    TagModule,
  ],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './monitoreo-scoops.component.html',
  styleUrl: './monitoreo-scoops.component.css',
})
export class MonitoreoScoopsComponent implements OnInit, OnDestroy {
  fechaActual = '';
  turnoActual = '';
  scoopSeleccionado = '';

  dialogPantallaCompleta = false;
  ultimaActualizacion = '';

  intervaloRealTime: any;

  turnos = [
    { label: 'Todos', value: '' },
    { label: 'Día', value: 'DÍA' },
    { label: 'Noche', value: 'NOCHE' },
  ];

  scoops = [
    { label: 'Todos', value: '' },
    { label: 'Scoop 01', value: 'SCOOP-01' },
    { label: 'Scoop 02', value: 'SCOOP-02' },
    { label: 'Scoop 03', value: 'SCOOP-03' },
  ];

  resumen = {
    scoopsActivos: 0,
    operativos: 0,
    enDemora: 0,
    toneladasTurno: 0,
    viajes: 0,
  };

  toneladasPorHora: any[] = [];
  estadoActualScoops: any[] = [];
  eventosRecientes: any[] = [];

  chartTonHoraOptions: any = {};

  ngOnInit(): void {
    this.inicializarContextoTiempoReal();
    this.actualizarData();

    this.intervaloRealTime = setInterval(() => {
      this.actualizarData();
    }, 30000);
  }

  inicializarContextoTiempoReal(): void {
    const ahora = new Date();

    this.fechaActual = ahora.toISOString().slice(0, 10);
    this.turnoActual = this.obtenerTurnoActual(ahora);
  }
  private obtenerTurnoActual(fecha: Date): 'DÍA' | 'NOCHE' {
    const hora = fecha.getHours();

    // Ajusta esta lógica según tu operación real.
    // Ejemplo: DÍA 07:00 - 18:59, NOCHE 19:00 - 06:59
    if (hora >= 7 && hora < 19) {
      return 'DÍA';
    }

    return 'NOCHE';
  }

  ngOnDestroy(): void {
    if (this.intervaloRealTime) {
      clearInterval(this.intervaloRealTime);
    }
  }

  actualizarData(): void {
    /**
     * Aquí luego conectas tu API real:
     *
     * this.monitoreoScoopsService.obtenerMonitoreo({
     *   fecha: this.fecha,
     *   turno: this.turnoSeleccionado,
     *   scoop: this.scoopSeleccionado,
     * }).subscribe(...)
     */

    this.cargarDataSimulada();
    this.construirGraficoToneladasPorHora();
    this.ultimaActualizacion = new Date().toLocaleTimeString('es-PE');
  }

  aplicarFiltro(): void {
    this.actualizarData();
  }

  quitarFiltro(): void {
    this.scoopSeleccionado = '';
    this.actualizarData();
  }

  abrirPantallaCompleta(): void {
    this.dialogPantallaCompleta = true;
  }

  onDialogShow(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 250);
  }

  construirGraficoToneladasPorHora(): void {
    const rangos = this.toneladasPorHora.map((x) => x.rangoHora);
    const toneladas = this.toneladasPorHora.map((x) => x.toneladas);
    const acumulado = this.toneladasPorHora.map((x) => x.acumulado);
    const viajes = this.toneladasPorHora.map((x) => x.viajes);

    this.chartTonHoraOptions = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        top: 0,
        data: ['Toneladas', 'Acumulado', 'Viajes'],
      },
      grid: {
        left: 45,
        right: 55,
        top: 60,
        bottom: 45,
      },
      xAxis: {
        type: 'category',
        data: rangos,
        axisLabel: {
          rotate: 0,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Toneladas',
        },
        {
          type: 'value',
          name: 'Viajes',
        },
      ],
      series: [
        {
          name: 'Toneladas',
          type: 'bar',
          data: toneladas,
          barMaxWidth: 42,
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              const value = Number(params.value || 0);
              return value > 0 ? `${value.toFixed(1)} t` : '';
            },
          },
        },
        {
          name: 'Acumulado',
          type: 'line',
          data: acumulado,
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
        },
        {
          name: 'Viajes',
          type: 'line',
          yAxisIndex: 1,
          data: viajes,
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
        },
      ],
    };
  }

  getSeverityEstado(
    estado: string,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const value = String(estado || '').toUpperCase();

    if (value.includes('OPERATIVO')) return 'success';
    if (value.includes('DEMORA')) return 'warn';
    if (value.includes('MANTENIMIENTO')) return 'danger';
    if (value.includes('STAND BY')) return 'info';

    return 'secondary';
  }

  private obtenerFechaActual(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private cargarDataSimulada(): void {
    this.toneladasPorHora = [
      { rangoHora: '07-08', toneladas: 42.5, acumulado: 42.5, viajes: 5 },
      { rangoHora: '08-09', toneladas: 55.2, acumulado: 97.7, viajes: 7 },
      { rangoHora: '09-10', toneladas: 48.8, acumulado: 146.5, viajes: 6 },
      { rangoHora: '10-11', toneladas: 62.4, acumulado: 208.9, viajes: 8 },
      { rangoHora: '11-12', toneladas: 51.3, acumulado: 260.2, viajes: 6 },
      { rangoHora: '12-13', toneladas: 37.9, acumulado: 298.1, viajes: 4 },
      { rangoHora: '13-14', toneladas: 69.6, acumulado: 367.7, viajes: 9 },
    ];

    this.estadoActualScoops = [
      {
        equipo: 'SCOOP-01',
        estado: 'OPERATIVO',
        codigo: '101',
        labor: 'TJ-450 NV-1200',
        horaInicio: '10:15',
      },
      {
        equipo: 'SCOOP-02',
        estado: 'DEMORA',
        codigo: '205',
        labor: 'XC-320 NV-1100',
        horaInicio: '10:30',
      },
      {
        equipo: 'SCOOP-03',
        estado: 'MANTENIMIENTO',
        codigo: '301',
        labor: 'RP-210 NV-1000',
        horaInicio: '09:55',
      },
    ];

    this.eventosRecientes = [
      {
        horaInicio: '10:15',
        horaFin: '',
        equipo: 'SCOOP-01',
        estado: 'OPERATIVO',
        codigo: '101',
        labor: 'TJ-450 NV-1200',
        toneladas: 18.5,
      },
      {
        horaInicio: '10:30',
        horaFin: '',
        equipo: 'SCOOP-02',
        estado: 'DEMORA',
        codigo: '205',
        labor: 'XC-320 NV-1100',
        toneladas: 0,
      },
    ];

    this.resumen = {
      scoopsActivos: 3,
      operativos: 1,
      enDemora: 1,
      toneladasTurno: 367.7,
      viajes: 45,
    };
  }
}
