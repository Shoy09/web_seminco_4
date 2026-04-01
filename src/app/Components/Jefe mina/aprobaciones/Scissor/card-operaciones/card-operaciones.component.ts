import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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

  formValues: Record<string, any> = {
  fecha: '',
  turno: '',
  equipo: '',
  codigo: '',
  operador: '',
  jefeGuardia: '',
};

  campos = [
  { key: 'turno',       options: ['DÍA', 'NOCHE'] },
  { key: 'equipo',      options: ['ZTTT', 'XRRR'] },
  { key: 'codigo',      options: ['T12', 'T15'] },
  { key: 'jefeGuardia', options: ['6666 6666', '7777 7777'] },
];


  ngOnChanges(changes: SimpleChanges): void {
  if (changes['data'] && this.data) {
    this.cargarDatos();
    //console.log('🔥 DATA MAPEADA:', this.data);
  }
}

cargarDatos() {

  this.agregarOpcionSiNoExiste('equipo', this.data.equipo);
  this.agregarOpcionSiNoExiste('codigo', this.data.codigo);


  this.formValues = {
  fecha: this.data.fecha,
  turno: this.data.turno,
  equipo: this.data.equipo,
  codigo: this.data.codigo,
  operador: this.data.operador,
  jefeGuardia: this.data.jefeGuardia,
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