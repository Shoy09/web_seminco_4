import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css'
})
export class ResumenComponent implements OnChanges {

  @Input() data: any; // 🔥 viene del padre

  resumenData = {
    equiposTaladrosLargos: 0,
    totalPerforado: 0,
    metrosPorLabor: 0,
    laboresPerforadas: 0,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {

      this.resumenData = {
        equiposTaladrosLargos: this.data.conteoEquipos || 0,
        totalPerforado: this.data.totalMetros || 0,
        metrosPorLabor: this.data.metrosPorDisparo || 0,
        laboresPerforadas: this.data.nDisparosTL || 0,
      };
    }
  }
}
