import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import {
  FiltrosDashboard,
  OpcionFiltroDashboard,
  TipoFiltroDashboard,
} from '../../models/dashboard-filtros.model';

@Component({
  selector: 'app-dashboard-filtros',
  standalone: true,
  imports: [FormsModule, SelectButtonModule, DatePickerModule, SelectModule, ButtonModule],
  templateUrl: './dashboard-filtros.component.html',
  styleUrl: './dashboard-filtros.component.css',
})
export class DashboardFiltrosComponent {
  readonly turnos = [
    { label: 'Todos', value: '' },
    { label: 'Dia', value: 'DÍA' },
    { label: 'Noche', value: 'NOCHE' },
  ];

  @Input() tiposFiltro: OpcionFiltroDashboard[] = [
    { label: 'Rango', value: 'rango' },
    { label: 'Año', value: 'anio' },
    { label: 'Mes', value: 'mes' },
    { label: 'Semana', value: 'semana' },
    { label: 'Día', value: 'dia' },
  ];
  @Input() mostrarPresentacion = true;
  @Input() mostrarPdf = true;
  @Input() mostrarVista = false;
  @Input() etiquetaVistaPrincipal = 'Graficos';
  @Input() tipoFiltro: TipoFiltroDashboard = 'dia';
  @Input() anioSeleccionado: Date | null = null;
  @Input() mesSeleccionado: Date | null = null;
  @Input() semanaSeleccionada: Date | null = null;
  @Input() diaSeleccionado: Date | null = null;
  @Input() rangoFechas: Date[] | null = null;
  @Input() turnoSeleccionado: string | null = '';
  @Input() vistaPrincipal = true;

  @Output() aplicar = new EventEmitter<FiltrosDashboard>();
  @Output() quitar = new EventEmitter<void>();
  @Output() presentacion = new EventEmitter<void>();
  @Output() pdf = new EventEmitter<void>();
  @Output() toggleVista = new EventEmitter<void>();

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
    this.tipoFiltro = 'rango';
    this.limpiarFechasPorTipo();
    this.turnoSeleccionado = '';
    this.quitar.emit();
  }
}
