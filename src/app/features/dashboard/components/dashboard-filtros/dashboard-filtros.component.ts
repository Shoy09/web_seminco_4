import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TurnoService } from '../../../../services/turno.service';
import { Turno } from '../../../../models/Turno';
import {
  FiltrosDashboard,
  OpcionFiltroDashboard,
  TipoFiltroDashboard,
} from '../../models/dashboard-filtros.model';

interface TurnoOption {
  label: string;
  value: number | null;
}

@Component({
  selector: 'app-dashboard-filtros',
  standalone: true,
  imports: [FormsModule, SelectButtonModule, DatePickerModule, SelectModule, ButtonModule],
  templateUrl: './dashboard-filtros.component.html',
  styleUrl: './dashboard-filtros.component.css',
})
export class DashboardFiltrosComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);

  turnoOptions: TurnoOption[] = [];
  loadingTurnos = false;

  turnoIdSeleccionado: number | null = null;

  private _turnoSeleccionado: string | null = '';
  private turnoNombreToId = new Map<string, number>();

  @Input()
  set turnoSeleccionado(val: string | null) {
    this._turnoSeleccionado = val;
    this.turnoIdSeleccionado = val ? (this.turnoNombreToId.get(val) ?? null) : null;
  }
  get turnoSeleccionado(): string | null {
    return this._turnoSeleccionado;
  }

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
  @Input() vistaPrincipal = true;

  @Output() aplicar = new EventEmitter<FiltrosDashboard>();
  @Output() quitar = new EventEmitter<void>();
  @Output() presentacion = new EventEmitter<void>();
  @Output() pdf = new EventEmitter<void>();
  @Output() toggleVista = new EventEmitter<void>();

  ngOnInit(): void {
    this.cargarTurnos();
  }

  private cargarTurnos(): void {
    this.loadingTurnos = true;
    this.turnoService
      .getTurnos()
      .pipe(finalize(() => (this.loadingTurnos = false)))
      .subscribe({
        next: (turnos) => {
          this.turnoNombreToId.clear();
          turnos.forEach((t) => this.turnoNombreToId.set(t.nombre, t.turnoId));

          this.turnoOptions = [
            { label: 'Todos', value: null },
            ...turnos.map((t) => ({ label: t.nombre, value: t.turnoId })),
          ];

          if (this._turnoSeleccionado) {
            this.turnoIdSeleccionado =
              this.turnoNombreToId.get(this._turnoSeleccionado) ?? null;
          }
        },
        error: () => {
          this.turnoOptions = [{ label: 'Todos', value: null }];
        },
      });
  }

  limpiarFechasPorTipo(): void {
    this.anioSeleccionado = null;
    this.mesSeleccionado = null;
    this.semanaSeleccionada = null;
    this.diaSeleccionado = null;
    this.rangoFechas = null;
  }

  aplicarFiltro(): void {
    const nombre =
      this.turnoIdSeleccionado != null
        ? [...this.turnoNombreToId.entries()].find(
            ([, id]) => id === this.turnoIdSeleccionado,
          )?.[0] ?? ''
        : '';
    this._turnoSeleccionado = nombre;

    this.aplicar.emit({
      tipoFiltro: this.tipoFiltro,
      anioSeleccionado: this.anioSeleccionado,
      mesSeleccionado: this.mesSeleccionado,
      semanaSeleccionada: this.semanaSeleccionada,
      diaSeleccionado: this.diaSeleccionado,
      rangoFechas: this.rangoFechas,
      turnoSeleccionado: nombre,
      turnoIdSeleccionado: this.turnoIdSeleccionado,
    });
  }

  quitarFiltro(): void {
    this.tipoFiltro = 'rango';
    this.limpiarFechasPorTipo();
    this.turnoIdSeleccionado = null;
    this._turnoSeleccionado = '';
    this.quitar.emit();
  }
}
