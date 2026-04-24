import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-sostenimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-sostenimiento.component.html',
  styleUrl: './detalle-sostenimiento.component.css'
})
export class DetalleSostenimientoComponent implements OnChanges {

  @Input() data: any[] = [];

  displayedData: any[] = [];
  totales: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('🔥 DETALLE SOSTENIMIENTO RECIBIDO:', this.data);
      this.processData();
    }
  }

  processData(): void {
    if (!this.data || this.data.length === 0) {
      this.displayedData = [];
      this.totales = {};
      return;
    }

    // Procesar cada fila con los campos solicitados
    this.displayedData = this.data.map(item => ({
      registros: Number(item.registros) || 1,  // Por defecto 1 si no viene
      modelo_equipo: item.modelo_equipo || 'N/A',
      labor_sos: item.labor_sos || 'N/A',
      seccion_labor: item.seccion_labor || 'N/A',
      tipo_pernos: item.tipo_pernos || 'N/A',
      n_pernos: Number(item.n_pernos) || 0,
      log_pernos: Number(item.log_pernos) || 0,
      mt52_malla: item.mt52_malla || 'N/A',
      metros_perforados: Number(item.metros_perforados) || 0
    }));

    // Calcular totales / promedios
    const count = this.displayedData.length;
    
    this.totales = {
      registros: this.displayedData.reduce((sum, item) => sum + item.registros, 0),
      n_pernos: this.displayedData.reduce((sum, item) => sum + item.n_pernos, 0),
      log_pernos: this.displayedData.reduce((sum, item) => sum + item.log_pernos, 0),
      mt52_malla: this.displayedData.reduce((sum, item) => sum + Number(item.mt52_malla), 0),
      metros_perforados: this.displayedData.reduce((sum, item) => sum + item.metros_perforados, 0)
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