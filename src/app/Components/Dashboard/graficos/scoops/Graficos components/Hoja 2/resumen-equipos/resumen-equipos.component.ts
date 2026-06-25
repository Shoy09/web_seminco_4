import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface ResumenEquipoItem {
  modeloEquipo?: string;
  DiferenciaDiesel?: number;
  HorasOperativo?: number;
  TotalCucharas?: number;
  Tn_h_SC?: number;
  Tonelaje?: number;
}

@Component({
  selector: 'app-resumen-equipos',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './resumen-equipos.component.html',
})
export class ResumenEquiposComponent implements OnChanges {
  @Input() data: any[] = [];

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

    this.displayedData = this.data
      .map((item) => {
        const raw = item as any;
        return {
          equipo: raw.modeloEquipo || 'N/A',
          horasDiesel: Number(raw.DiferenciaDiesel ?? raw.horasDiesel ?? 0),
          horasOperativas: Number(raw.HorasOperativo ?? raw.horasOperativas ?? 0),
          nCucharas: Number(raw.TotalCucharas ?? raw.nCucharas ?? 0),
          tnHr: Number(raw.Tn_h_SC ?? raw.tnHr ?? 0),
          tonelaje: Number(raw.Tonelaje ?? raw.tonelaje ?? 0),
        };
      })
      .sort((a, b) => a.equipo.localeCompare(b.equipo));

    const totalHoras = this.displayedData.reduce((s, i) => s + i.horasOperativas, 0);
    const totalTonn = this.displayedData.reduce((s, i) => s + i.tonelaje, 0);

    this.totales = {
      horasDiesel: this.displayedData.reduce((s, i) => s + i.horasDiesel, 0),
      horasOperativas: totalHoras,
      nCucharas: this.displayedData.reduce((s, i) => s + i.nCucharas, 0),
      tnHr: totalHoras > 0 ? totalTonn / totalHoras : 0,
      tonelaje: totalTonn,
    };
  }
}