import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

export type TipoFiltroFecha = 'anio' | 'mes' | 'semana' | 'dia' | 'rango';

export interface OpcionFiltro {
  label: string;
  value: string;
}

export interface FiltrosReporte {
  tipoFiltro: TipoFiltroFecha;
  anioSeleccionado: Date | null;
  mesSeleccionado: Date | null;
  semanaSeleccionada: Date | null;
  diaSeleccionado: Date | null;
  rangoFechas: Date[] | null;
  turnoSeleccionado: string | null;
}

@Component({
  selector: 'app-filtros-reporte',
  standalone: true,
  imports: [
    FormsModule,
    SelectButtonModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
  ],
  templateUrl: './filtros-reporte.component.html',
})
export class FiltrosReporteComponent {
  turnos = [
    { label: 'Todos', value: '' },
    { label: 'Día', value: 'dia' },
    { label: 'Noche', value: 'noche' },
  ];

  @Input() tiposFiltro: OpcionFiltro[] = [
    { label: 'Año', value: 'anio' },
    { label: 'Mes', value: 'mes' },
    { label: 'Semana', value: 'semana' },
    { label: 'Día', value: 'dia' },
    { label: 'Rango', value: 'rango' },
  ];

  @Input() mostrarPresentacion = true;
  @Input() mostrarPdf = true;

  @Output() aplicar = new EventEmitter<FiltrosReporte>();
  @Output() quitar = new EventEmitter<void>();
  @Output() presentacion = new EventEmitter<void>();
  @Output() pdf = new EventEmitter<void>();

  tipoFiltro: TipoFiltroFecha = 'dia';

  anioSeleccionado: Date | null = null;
  mesSeleccionado: Date | null = null;
  semanaSeleccionada: Date | null = null;
  diaSeleccionado: Date | null = null;
  rangoFechas: Date[] | null = null;
  turnoSeleccionado: string | null = 'dia';

  limpiarFechasPorTipo(): void {
    this.anioSeleccionado = null;
    this.mesSeleccionado = null;
    this.semanaSeleccionada = null;
    this.diaSeleccionado = null;
    this.rangoFechas = null;
  }

  aplicarFiltro(): void {
    this.aplicar.emit({
      tipoFiltro: this.tipoFiltro,
      anioSeleccionado: this.anioSeleccionado,
      mesSeleccionado: this.mesSeleccionado,
      semanaSeleccionada: this.semanaSeleccionada,
      diaSeleccionado: this.diaSeleccionado,
      rangoFechas: this.rangoFechas,
      turnoSeleccionado: this.turnoSeleccionado,
    });
  }

  quitarFiltro(): void {
    this.tipoFiltro = 'mes';
    this.limpiarFechasPorTipo();
    this.turnoSeleccionado = null;

    this.quitar.emit();
  }

  emitirPresentacion(): void {
    this.presentacion.emit();
  }

  emitirPdf(): void {
    this.pdf.emit();
  }
}