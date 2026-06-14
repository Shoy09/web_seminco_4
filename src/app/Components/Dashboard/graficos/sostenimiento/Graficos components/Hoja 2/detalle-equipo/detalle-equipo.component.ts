import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface DetalleEquipoItem {
  modelo_equipo: string;
  diferencia_percusion: number;
  log_pernos: number;
  metros_perforados: number;
  n_labores_sostenidas: number;
  n_pernos: number;
  n_pernos_por_labor: number;
  sos_m_hr_hp: number;
}

@Component({
  selector: 'app-detalle-equipo',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './detalle-equipo.component.html',
  styleUrl: './detalle-equipo.component.css',
})
export class DetalleEquipoComponent implements OnChanges {
  @Input() data: DetalleEquipoItem[] = [];

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
      equipo: item.modelo_equipo || 'N/A',
      diferencia_percusion: Number(item.diferencia_percusion) || 0,
      log_pernos: Number(item.log_pernos) || 0,
      metros_perforados: Number(item.metros_perforados) || 0,
      n_labores_sostenidas: Number(item.n_labores_sostenidas) || 0,
      n_pernos: Number(item.n_pernos) || 0,
      n_pernos_por_labor: Number(item.n_pernos_por_labor) || 0,
      sos_m_hr_hp: Number(item.sos_m_hr_hp) || 0,
    }));

    const count = this.displayedData.length || 1;

    const sum = (campo: string) =>
      this.displayedData.reduce((acc, item) => acc + (item[campo] || 0), 0);

    this.totales = {
      diferencia_percusion: sum('diferencia_percusion'),
      log_pernos: sum('log_pernos') / count,
      metros_perforados: sum('metros_perforados'),
      n_labores_sostenidas: sum('n_labores_sostenidas'),
      n_pernos: sum('n_pernos'),
      n_pernos_por_labor: sum('n_pernos_por_labor') / count,
      sos_m_hr_hp: sum('sos_m_hr_hp') / count,
    };
  }
}
