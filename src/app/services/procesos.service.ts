import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Proceso } from '../models/Proceso';

@Injectable({
  providedIn: 'root'
})
export class ProcesosService {
  private baseUrl = 'procesos';

  constructor(private apiService: ApiService) {}

  getProcesos(): Observable<Proceso[]> {
    return this.apiService.getDatos<Proceso[]>(`${this.baseUrl}/`);
  }

  createProceso(proceso: Omit<Proceso, 'id'>): Observable<Proceso> {
    return this.apiService.postDatos(`${this.baseUrl}/`, proceso);
  }

  updateProceso(id: number, proceso: Omit<Proceso, 'id'>): Observable<Proceso> {
    return this.apiService.putDatos(`${this.baseUrl}/${id}`, proceso);
  }

  deleteProceso(id: number): Observable<void> {
    return this.apiService.deleteDatos(`${this.baseUrl}/${id}`);
  }
}
