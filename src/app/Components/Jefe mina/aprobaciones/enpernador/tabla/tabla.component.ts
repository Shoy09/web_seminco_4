import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormularioOperacionComponent } from "../formulario-operacion/formulario-operacion.component";
import { FormularioPerforacionComponent } from "../formulario-perforacion/formulario-perforacion.component";

interface Operacion {
  nivel: string;
  tipo_labor: string;
  labor: string;
  ala: string;
  observaciones?: string;
}

interface Registro {
  nro: number;
  estado: string;
  codigo: string;
  horaInicio: string;
  horaFin: string;
  color: string;
  operacion: Operacion; // 🔥 NUEVO
}

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule, FormularioOperacionComponent, FormularioPerforacionComponent],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnChanges {

  @Input() data: any[] = [];

  public datos: Registro[] = [];
public mostrarOperacion = false;
public mostrarPerforacion = false;
public estadoSeleccionado = '';
public horaInicioSeleccionado = '';
public codigoSeleccionado = '';
public operacionSeleccionada: Operacion | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.mapearDatos();
      console.log('🔥 DATA TABLA:', this.data);
    }
  }

  mapearDatos() {
  this.datos = this.data.map((item: any) => ({
    nro: item.numero,
    estado: item.estado,
    codigo: item.codigo,
    horaInicio: item.hora_inicio,
    horaFin: item.hora_final || '--:--',
    color: this.getColorEstado(item.estado),

    // 🔥 IMPORTANTE
    operacion: item.operacion || {
      nivel: '',
      tipo_labor: '',
      labor: '',
      ala: '',
      observaciones: ''
    }

  }));
}

  getColorEstado(estado: string): string {
    const e = estado?.toUpperCase();

    if (e === 'OPERATIVO') return '#28a745';
    if (e === 'DEMORA') return '#ffc107';
    if (e === 'MANTENIMIENTO') return '#dc3545';

    return '#6c757d'; // gris por defecto
  }

  onEdit(item: Registro) {
  console.log('Editando:', item);

  this.estadoSeleccionado = item.estado; // opcional
  this.codigoSeleccionado = item.codigo; // opcional
  this.horaInicioSeleccionado = item.horaInicio; // opcional
  this.mostrarOperacion = true; // 🔥 abre modal
}

onExecute(item: Registro) {
  console.log('Ejecutando:', item);

  this.operacionSeleccionada = item.operacion; // 🔥 aquí está la magia
  this.mostrarPerforacion = true;
}

  onDelete(item: Registro) {
    console.log('Borrando:', item);
  }
}