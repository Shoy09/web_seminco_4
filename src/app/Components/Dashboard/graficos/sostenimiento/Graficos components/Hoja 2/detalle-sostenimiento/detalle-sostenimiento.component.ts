import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface DetalleSostenimientoItem {
  modelo_equipo: string;
  labor_sos: string;
  seccion_labor: string;
  tipo_pernos: string;
  n_pernos: number;
  log_pernos: number;
  mt52_malla: number;
  metros_perforados: number;
  registros: number;
}

@Component({
  selector: 'app-detalle-sostenimiento',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './detalle-sostenimiento.component.html',
  styleUrl: './detalle-sostenimiento.component.css',
})
export class DetalleSostenimientoComponent implements OnChanges {
  @Input() data: DetalleSostenimientoItem[] = [];

  displayedData: any[] = [];
  totales: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.processData();
    }
  }

  processData(): void {
    if (!this.data || this.data.length === 0) {
      this.displayedData = [];
      this.totales = {};
      return;
    }

    this.displayedData = this.data.map((item) => ({
      registros: Number(item.registros) || 1,
      modelo_equipo: item.modelo_equipo || 'N/A',
      labor_sos: item.labor_sos || 'N/A',
      seccion_labor: item.seccion_labor || 'N/A',
      tipo_pernos: item.tipo_pernos || 'N/A',
      n_pernos: Number(item.n_pernos) || 0,
      log_pernos: Number(item.log_pernos) || 0,
      mt52_malla: Number(item.mt52_malla) || 0,
      metros_perforados: Number(item.metros_perforados) || 0,
    }));

    const count = this.displayedData.length;

    this.totales = {
      registros: this.displayedData.reduce(
        (sum, item) => sum + item.registros,
        0,
      ),
      n_pernos: this.displayedData.reduce(
        (sum, item) => sum + item.n_pernos,
        0,
      ),
      log_pernos:
        count > 0
          ? this.displayedData.reduce((sum, item) => sum + item.log_pernos, 0) /
            count
          : 0,
      mt52_malla: this.displayedData.reduce(
        (sum, item) => sum + Number(item.mt52_malla),
        0,
      ),
      metros_perforados: this.displayedData.reduce(
        (sum, item) => sum + item.metros_perforados,
        0,
      ),
    };
  }
}
