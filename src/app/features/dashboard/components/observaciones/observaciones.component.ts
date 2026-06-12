import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface ObservacionItem {
  modelo_equipo?: string;
  operador?: string;
  labor_fr?: string;
  observaciones?: string;
  equipo?: string;
  nombre_operador?: string;
  labor?: string;
  seccion_labor?: string;
  observacion?: string;
  descripcion?: string;
  count?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-observaciones',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './observaciones.component.html',
  styleUrl: './observaciones.component.css',
})
export class ObservacionesComponent implements OnChanges {
  @Input() data: ObservacionItem[] = [];

  displayedData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.processData();
    }
  }

  processData(): void {
    if (!this.data || this.data.length === 0) {
      this.displayedData = [];
      return;
    }

    this.displayedData = this.data.map((item) => ({
      operador: item.operador || item.nombre_operador || 'N/A',
      equipo: item.equipo || item.modelo_equipo || 'N/A',
      labor: item.labor || item.labor_fr || item.seccion_labor || '',
      observacion:
        item.observacion || item.observaciones || item.descripcion || '',
    }));
  }
}
