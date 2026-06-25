import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface MejorOperadorItem {
  operador: string;
  turno: string;
  Tonelaje: number;
  HorasOperativo: number;
  TnxHr: number;
}

@Component({
  selector: 'app-mejores-operadores',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './mejores-operadores.component.html',
  styleUrl: './mejores-operadores.component.css'
})
export class MejoresOperadoresComponent implements OnChanges {
  /** Acepta MejorOperadorItem[] o datos legacy con operador/turno/Tonelaje/TnxHr */
  @Input() data: MejorOperadorItem[] = [];

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
      .map(item => {
        const raw = item as any;
        const tn = Number(raw.Tonelaje ?? raw.tonelaje ?? 0);
        const th = Number(raw.TnxHr ?? raw.tnHr ?? raw.tn_h ?? 0);
        return {
          operador: raw.operador || 'N/A',
          turno: raw.turno || 'N/A',
          tonelaje: tn,
          tnHr: th,
        };
      })
      .sort((a, b) => {
        if (b.tonelaje !== a.tonelaje) return b.tonelaje - a.tonelaje;
        return b.tnHr - a.tnHr;
      });
  }
}