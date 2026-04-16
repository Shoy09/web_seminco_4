import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mejores-operadores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mejores-operadores.component.html',
  styleUrl: './mejores-operadores.component.css'
})
export class MejoresOperadoresComponent implements OnChanges {

  @Input() data: any[] = [];

  displayedData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      //console.log('🔥 MEJORES OPERADORES RECIBIDO:', this.data);
      this.processData();
    }
  }

  processData(): void {
    if (!this.data || this.data.length === 0) {
      this.displayedData = [];
      return;
    }

    // Ordenar por M/Hr de mayor a menor
    const sortedData = [...this.data].sort((a, b) => {
      const mhrA = a.m_hr || a.fr_mhr_hp || 0;
      const mhrB = b.m_hr || b.fr_mhr_hp || 0;
      return mhrB - mhrA;
    });

    // Formatear los datos
    this.displayedData = sortedData.map(item => ({
      operador: item.operador || item.nombre_operador || 'N/A',
      turno: item.turno || 'DÍA',
      m_hr: item.m_hr || item.fr_mhr_hp || 0,
      metros_perforados: item.metros_perforados || 0
    }));
  }

  formatearNumero(valor: number, decimales: number = 2): string {
    if (isNaN(valor)) return '0';
    return valor.toFixed(decimales);
  }
}