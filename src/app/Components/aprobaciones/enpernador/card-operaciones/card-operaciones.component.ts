// card-operaciones.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-operaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './card-operaciones.component.html',
  styleUrls: ['./card-operaciones.component.css']
})
export class CardOperacionesComponent {

  formValues: Record<string, any> = {
    fecha: '2026-03-12',
    turno: 'DÍA',
    equipo: 'ZTTT',
    codigo: 'T12',
    operador: '',
    jefeGuardia: '6666 6666',
    seccion: 'Sección A',
    tiposEquipo: { diesel: true, electrico: true }
  };

  campos = [
    { key: 'turno',       options: ['DÍA', 'NOCHE'] },
    { key: 'equipo',      options: ['ZTTT', 'XRRR'] },
    { key: 'codigo',      options: ['T12', 'T15'] },
    { key: 'jefeGuardia', options: ['6666 6666', '7777 7777'] },
    { key: 'seccion',     options: ['Sección A', 'Sección B'] },
  ];

  tiposEquipo = [
    { label: 'Diesel',    value: 'diesel' },
    { label: 'Eléctrico', value: 'electrico' }
  ];

  getCampo(key: string) {
    return this.campos.find(c => c.key === key) || { key, options: [] };
  }

  crearOperacion() {
    console.log('Generando operación...', this.formValues);
  }
}