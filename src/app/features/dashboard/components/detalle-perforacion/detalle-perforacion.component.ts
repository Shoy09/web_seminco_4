import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface DetallePerforacionItem {
  modelo_equipo: string;
  metros_perforados: number;
  percusion: number;
  long_barras: number;
  fr_mhr_hp: number;
  tal_alivio: number;
  tal_prod: number;
  tal_repaso: number;
  tal_rimados: number;
  alivio?: number;
  prod?: number;
  rim?: number;
  repaso?: number;
  horas_percutadas?: number;
}

@Component({
  selector: 'app-detalle-perforacion',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './detalle-perforacion.component.html',
  styleUrl: './detalle-perforacion.component.css',
})
export class DetallePerforacionComponent implements OnChanges {
  @Input() data: DetallePerforacionItem[] = [];

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
      horas_percutadas: item.horas_percutadas || item.percusion || 0,
      tal_prod: item.tal_prod || item.prod || 0,
      tal_rimados: item.tal_rimados || item.rim || 0,
      tal_repaso: item.tal_repaso || item.repaso || 0,
      tal_alivio: item.tal_alivio || item.alivio || 0,
      long_barras: item.long_barras || 0,
      fr_mhr_hp: item.fr_mhr_hp || 0,
      metros_perforados: item.metros_perforados || 0,
    }));

    this.totales = {
      horas_percutadas: this.displayedData.reduce(
        (sum, item) => sum + item.horas_percutadas,
        0,
      ),
      tal_prod: this.displayedData.reduce(
        (sum, item) => sum + item.tal_prod,
        0,
      ),
      tal_rimados: this.displayedData.reduce(
        (sum, item) => sum + item.tal_rimados,
        0,
      ),
      tal_repaso: this.displayedData.reduce(
        (sum, item) => sum + item.tal_repaso,
        0,
      ),
      tal_alivio: this.displayedData.reduce(
        (sum, item) => sum + item.tal_alivio,
        0,
      ),
      long_barras:
        this.displayedData.reduce((sum, item) => sum + item.long_barras, 0) /
        this.displayedData.length,
      fr_mhr_hp:
        this.displayedData.reduce((sum, item) => sum + item.fr_mhr_hp, 0) /
        this.displayedData.length,
      metros_perforados: this.displayedData.reduce(
        (sum, item) => sum + item.metros_perforados,
        0,
      ),
    };
  }
}
