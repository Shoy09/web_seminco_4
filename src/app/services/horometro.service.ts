import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { TipoHorometro } from '../models/TipoHorometro';

@Injectable({
  providedIn: 'root'
})
export class HorometroService {
  private baseUrl = 'tipo-horometro';
  private horometrosActualizados = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) {}

  getHorometros(): Observable<TipoHorometro[]> {
    return this.apiService.getDatos<TipoHorometro[]>(`${this.baseUrl}`);
  }

  createHorometro(data: { nombre: string }): Observable<TipoHorometro> {
    return this.apiService
      .postDatos(`${this.baseUrl}`, data)
      .pipe(tap(() => this.horometrosActualizados.next(true)));
  }

  updateHorometro(id: number, data: { nombre: string }): Observable<TipoHorometro> {
    return this.apiService
      .putDatos(`${this.baseUrl}/${id}`, data)
      .pipe(tap(() => this.horometrosActualizados.next(true)));
  }

  deleteHorometro(id: number): Observable<void> {
    return this.apiService
      .deleteDatos(`${this.baseUrl}/${id}`)
      .pipe(tap(() => this.horometrosActualizados.next(true)));
  }

  getHorometrosActualizados(): Observable<boolean> {
    return this.horometrosActualizados.asObservable();
  }
}
