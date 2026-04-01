import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OperacionBase } from '../../../../../models/OperacionBase.models';

@Component({
  selector: 'app-card-operaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './card-operaciones.component.html',
  styleUrls: ['./card-operaciones.component.css']
})
export class CardOperacionesComponent implements OnChanges {

  // 🔥 RECIBE LA DATA REAL
  @Input() data!: any;
  @Output() dataChange = new EventEmitter<any>();
isDirty = false;
  formValues: Record<string, any> = {
    fecha: '',
    turno: '',
    equipo: '',
    codigo: '',
    modelo_equipo: '',
    operador: '',
    jefeGuardia: '',
    seccion: '',
  };

  campos = [
    { key: 'turno',       options: ['DÍA', 'NOCHE'] },
    { key: 'equipo',      options: ['ZTTT', 'XRRR'] },
    { key: 'codigo',      options: ['T12', 'T15'] },
     { key: 'modelo_equipo', options: [] },
    { key: 'jefeGuardia', options: ['6666 6666', '7777 7777'] },
    { key: 'seccion',     options: ['Sección A', 'Sección B'] },
  ];


  ngOnChanges(changes: SimpleChanges): void {
  if (changes['data'] && changes['data'].currentValue) {

    // 🔥 si el usuario ya editó, no sobreescribas
    if (this.isDirty) return;

    this.cargarDatos();
  }
}

onChange() {
  this.isDirty = true;

  console.log('🟡 CARD - formValues actualizado:', this.formValues);

  this.dataChange.emit({
    ...this.formValues
  });
}

cargarDatos() {

  this.agregarOpcionSiNoExiste('equipo', this.data.equipo);
  this.agregarOpcionSiNoExiste('codigo', this.data.codigo);
  this.agregarOpcionSiNoExiste('modelo_equipo', this.data.modelo_equipo); // 🔥
  this.agregarOpcionSiNoExiste('seccion', this.data.seccion);

  this.formValues = {
    fecha: this.data.fecha,
    turno: this.data.turno,
    equipo: this.data.equipo,
    codigo: this.data.codigo,
    modelo_equipo: this.data.modelo_equipo, // 🔥
    operador: this.data.operador,
    jefeGuardia: this.data.jefeGuardia,
    seccion: this.data.seccion
  };
}

agregarOpcionSiNoExiste(key: string, valor: string) {
  const campo = this.campos.find(c => c.key === key);

  if (!campo) return;

  if (valor && !campo.options.includes(valor)) {
    campo.options = [valor, ...campo.options];
  }
}

  getCampo(key: string) {
    return this.campos.find(c => c.key === key) || { key, options: [] };
  }

}