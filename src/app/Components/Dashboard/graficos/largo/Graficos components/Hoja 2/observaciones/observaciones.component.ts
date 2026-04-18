import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-observaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './observaciones.component.html',
  styleUrl: './observaciones.component.css'
})
export class ObservacionesComponent implements OnChanges {

  @Input() data: any[] = [];

  displayedData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      //console.log('🔥 OBSERVACIONES RECIBIDO:', this.data);
      this.processData();
    }
  }

  processData(): void {
    if (!this.data || this.data.length === 0) {
      this.displayedData = [];
      return;
    }

    // Formatear los datos
    this.displayedData = this.data.map(item => ({
      operador: item.operador || item.nombre_operador || 'N/A',
      equipo: item.equipo || item.modelo_equipo || 'N/A',
      labor: item.labor || item.labor_fr || item.seccion_labor || '',
      observacion: item.observacion || item.observaciones || item.descripcion || ''
    }));
  }
}