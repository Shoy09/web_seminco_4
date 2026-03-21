import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Registro {
  nro: number;
  estado: string;
  codigo: string;
  horaInicio: string;
  horaFin: string;
  color: string; // Color para el badge (ej: #4CAF50)
}

@Component({
  selector: 'app-tabla',
  imports: [CommonModule],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  public datos: Registro[] = [
    { nro: 1, estado: 'OPERATIVO', codigo: '104', horaInicio: '07:00', horaFin: '--:--', color: '#28a745' }
  ];

  constructor() { }

  ngOnInit() { }

  onEdit(item: Registro) {
    console.log('Editando:', item.codigo);
  }

  onDelete(item: Registro) {
    console.log('Borrando:', item.codigo);
  }
}