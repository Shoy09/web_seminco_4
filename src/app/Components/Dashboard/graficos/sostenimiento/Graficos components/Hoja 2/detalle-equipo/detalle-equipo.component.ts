import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-equipo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-equipo.component.html',
  styleUrl: './detalle-equipo.component.css'
})
export class DetalleEquipoComponent implements OnChanges {

  @Input() data: any[] = [];

  displayedData: any[] = [];
  totales: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      //console.log('🔥 DETALLE EQUIPO RECIBIDO:', this.data);
      this.processData();
    }
  }

  processData(): void {
    if (!this.data || this.data.length === 0) {
      this.displayedData = [];
      this.totales = {};
      return;
    }

    // Procesar cada fila con los nuevos campos
    this.displayedData = this.data.map(item => ({
      equipo: item.modelo_equipo || 'N/A',
      diferencia_percusion: item.diferencia_percusion || 0,
      log_pernos: item.log_pernos || 0,
      metros_perforados: item.metros_perforados || 0,
      n_labores_sostenidas: item.n_labores_sostenidas || 0,
      n_pernos: item.n_pernos || 0,
      n_pernos_por_labor: item.n_pernos_por_labor || 0,
      sos_m_hr_hp: item.sos_m_hr_hp || 0
    }));

    // Calcular totales / promedios
    const count = this.displayedData.length;
    
    this.totales = {
      diferencia_percusion: this.displayedData.reduce((sum, item) => sum + item.diferencia_percusion, 0),
      log_pernos: this.displayedData.reduce((sum, item) => sum + item.log_pernos, 0),
      metros_perforados: this.displayedData.reduce((sum, item) => sum + item.metros_perforados, 0),
      n_labores_sostenidas: this.displayedData.reduce((sum, item) => sum + item.n_labores_sostenidas, 0),
      n_pernos: this.displayedData.reduce((sum, item) => sum + item.n_pernos, 0),
      n_pernos_por_labor: this.displayedData.reduce((sum, item) => sum + item.n_pernos_por_labor, 0) / count,
      sos_m_hr_hp: this.displayedData.reduce((sum, item) => sum + item.sos_m_hr_hp, 0) / count
    };
  }

  formatearNumero(valor: number, decimales: number = 2): string {
    if (isNaN(valor)) return '0';
    return valor.toFixed(decimales);
  }

  formatearEntero(valor: number): string {
    if (isNaN(valor)) return '0';
    return Math.round(valor).toString();
  }

  formatear1Decimal(valor: number): string {
    if (isNaN(valor)) return '0.0';
    return valor.toFixed(1);
  }
}