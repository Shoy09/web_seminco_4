import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface HoraPrimerViajeItem {
  modelo_equipo?: string;
  labor?: string;
  fecha?: string;
  turno?: string;
  hora_inicio?: string;
}

@Component({
  selector: 'app-horas-primer-viaje',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './horas-primer-viaje.component.html',
})
export class HorasPrimerViajeComponent implements OnChanges {
  @Input() data: HoraPrimerViajeItem[] = [];

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

    this.displayedData = this.data
      .map((item) => ({
        equipo: item.modelo_equipo || 'N/A',
        labor: item.labor || 'N/A',
        fecha: this.formatearFecha(item.fecha || ''),
        turno: item.turno || 'N/A',
        hora: this.formatearHora(item.hora_inicio || ''),
      }))
      .sort((a, b) => {
        const dateA = new Date(`${a.fecha} ${a.hora}`);
        const dateB = new Date(`${b.fecha} ${b.hora}`);
        return dateB.getTime() - dateA.getTime();
      });
  }

  formatearHora(horaStr: string): string {
    if (!horaStr) return '--:--';
    const parts = horaStr.split(':');
    const hora = (parts[0] || '0').padStart(2, '0');
    const minuto = (parts[1] || '0').padStart(2, '0');
    return `${hora}:${minuto}`;
  }

  formatearFecha(fechaStr: string): string {
    if (!fechaStr) return '--/--/----';
    const parts = fechaStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return fechaStr;
  }
}
