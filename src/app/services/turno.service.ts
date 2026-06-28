import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Turno } from '../models/Turno';
import { ApiService } from './api.service';

export type TurnoPayload = {
  nombre: string;
  codigo: string;
  horario_inicio: string;
  horario_fin: string;
  descripcion: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private readonly baseUrl = 'planes/turnos';

  constructor(private readonly apiService: ApiService) {}

  getTurnos(): Observable<Turno[]> {
    return this.apiService.getDatos(`${this.baseUrl}/`);
  }

  createTurno(payload: TurnoPayload): Observable<Turno> {
    return this.apiService.postDatos(`${this.baseUrl}/`, payload);
  }

  updateTurno(id: number, payload: TurnoPayload): Observable<Turno> {
    return this.apiService.putDatos(`${this.baseUrl}/${id}`, payload);
  }

  deleteTurno(id: number): Observable<void> {
    return this.apiService.deleteDatos(`${this.baseUrl}/${id}`);
  }
}
