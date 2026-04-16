import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horas-primera-perforacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horas-primera-perforacion.component.html',
  styleUrl: './horas-primera-perforacion.component.css'
})
export class HorasPrimeraPerforacionComponent implements OnChanges {

  @Input() data: any[] = [];

  displayedData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      //console.log('🔥 HORA PRIMERA PERFORACIÓN RECIBIDO:', this.data);
      this.processData();
    }
  }

  processData(): void {
    if (!this.data || this.data.length === 0) {
      this.displayedData = [];
      return;
    }

    // Formatear la hora (ej: "09:30" a "09:30:00 a.m.")
    this.displayedData = this.data.map(item => ({
      equipo: item.modelo_equipo || 'N/A',
      labor: item.labor_fr || item.seccion_labor || item.seccion || 'N/A',
      hora: this.formatearHora(item.hora_inicio || item.hora || '')
    }));
  }

  formatearHora(horaStr: string): string {
  if (!horaStr) return '--:--:--';

  const [hora, minuto] = horaStr.split(':');

  const horaNum = parseInt(hora, 10);
  const minutoNum = parseInt(minuto, 10);

  const hora24 = horaNum.toString().padStart(2, '0');
  const minutoStr = minutoNum.toString().padStart(2, '0');

  return `${hora24}:${minutoStr}:00`;
}
}