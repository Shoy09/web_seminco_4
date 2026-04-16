import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-disparos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-disparos.component.html',
  styleUrl: './detalle-disparos.component.css'
})
export class DetalleDisparosComponent implements OnChanges {

  @Input() data: any[] = [];

  displayedData: any[] = [];
  totales: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('🔥 DETALLE DE DISPAROS RECIBIDO:', this.data);
      this.processData();
    }
  }

  processData(): void {
    if (!this.data || this.data.length === 0) {
      this.displayedData = [];
      this.totales = {};
      return;
    }

    // Procesar cada fila
    this.displayedData = this.data.map(item => ({
      equipo: item.modelo_equipo || item.equipo || 'N/A',
      disparo: item.disparo || item.tipo_perforacion || item.tipo || 'N/A',
      labor: item.labor || item.labor_fr || item.seccion_labor || 'N/A',
      tal_prod: item.tal_prod || item.prod || 0,
      tal_rim: item.tal_rim || item.tal_rimados || item.rim || 0,
      tal_repaso: item.tal_repaso || item.repaso || 0,
      tal_alivio: item.tal_alivio || item.alivio || 0,
      pies: item.pies || item.long_barras || 0,
      metros_perforados: item.metros_perforados || 0
    }));

    // Calcular totales
    const totalTalProd = this.displayedData.reduce((sum, item) => sum + item.tal_prod, 0);
    const totalTalRim = this.displayedData.reduce((sum, item) => sum + item.tal_rim, 0);
    const totalTalRepaso = this.displayedData.reduce((sum, item) => sum + item.tal_repaso, 0);
    const totalTalAlivio = this.displayedData.reduce((sum, item) => sum + item.tal_alivio, 0);
    const totalPies = this.displayedData.reduce((sum, item) => sum + item.pies, 0);
    const totalMetros = this.displayedData.reduce((sum, item) => sum + item.metros_perforados, 0);

    this.totales = {
      tal_prod: totalTalProd,
      tal_rim: totalTalRim,
      tal_repaso: totalTalRepaso,
      tal_alivio: totalTalAlivio,
      pies: this.displayedData.length > 0 ? totalPies / this.displayedData.length : 0,
      metros_perforados: totalMetros
    };
  }

  formatearNumero(valor: number, decimales: number = 2): string {
    if (isNaN(valor)) return '0';
    return valor.toFixed(decimales);
  }

  formatear1Decimal(valor: number): string {
  if (isNaN(valor)) return '0.0';
  return valor.toFixed(1);
}
}