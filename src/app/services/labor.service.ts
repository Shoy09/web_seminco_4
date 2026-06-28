import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Labor } from '../models/Labor';
import { ApiService } from './api.service';

export type LaborPayload = Pick<
  Labor,
  | 'mina_id'
  | 'zona_id'
  | 'area_id'
  | 'fase_id'
  | 'tipo_labor_id'
  | 'estructura_mineral_id'
  | 'nivel_id'
  | 'ala_id'
  | 'nombre_labor'
  | 'estado'
>;

@Injectable({
  providedIn: 'root',
})
export class LaborService {
  private readonly baseUrl = 'planes/labores';

  constructor(private readonly apiService: ApiService) {}

  getLabores(): Observable<Labor[]> {
    return this.apiService.getDatos(`${this.baseUrl}/`);
  }

  createLabor(payload: LaborPayload): Observable<Labor> {
    return this.apiService.postDatos(`${this.baseUrl}/`, payload);
  }

  updateLabor(id: number, payload: LaborPayload): Observable<Labor> {
    return this.apiService.putDatos(`${this.baseUrl}/${id}`, payload);
  }

  deleteLabor(id: number): Observable<void> {
    return this.apiService.deleteDatos(`${this.baseUrl}/${id}`);
  }
}
