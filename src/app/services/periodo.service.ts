import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Periodo } from '../models/Periodo';
import { ApiService } from './api.service';

export type PeriodoPayload = {
  tipo: string;
  numero: number;
  anno: number;
  fecha_inicio: string;
  fecha_fin: string;
};

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  private readonly baseUrl = 'planes/periodos';

  constructor(private readonly apiService: ApiService) {}

  getPeriodos(): Observable<Periodo[]> {
    return this.apiService.getDatos(`${this.baseUrl}/`);
  }

  createPeriodo(payload: PeriodoPayload): Observable<Periodo> {
    return this.apiService.postDatos(`${this.baseUrl}/`, payload);
  }

  updatePeriodo(id: number, payload: PeriodoPayload): Observable<Periodo> {
    return this.apiService.putDatos(`${this.baseUrl}/${id}`, payload);
  }

  deletePeriodo(id: number): Observable<void> {
    return this.apiService.deleteDatos(`${this.baseUrl}/${id}`);
  }
}
