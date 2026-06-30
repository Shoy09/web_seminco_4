import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; // Importamos ApiService
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Estado } from '../models/Estado';
import { CategoriaEstado } from '../models/CategoriaEstado';

@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  private baseUrl = 'estado'; // Asegúrate de que coincide con tu backend
  private estadosActualizados = new BehaviorSubject<boolean>(false);
  constructor(private apiService: ApiService) {}

  getEstados(): Observable<Estado[]> {
    return this.apiService.getDatos(this.baseUrl);
  }

  getCategoriasEstados(): Observable<CategoriaEstado[]> {
    return this.apiService.getDatos<CategoriaEstado[]>('categorias-estados');
  }

  getEstadosByProceso(proceso: string): Observable<Estado[]> {
    return this.apiService.getDatos(`${this.baseUrl}/proceso/${proceso}`);
  }
  getEstadosByProcesoId(proceso: number): Observable<Estado[]> {
    return this.apiService.getDatos(`${this.baseUrl}/proceso-id/${proceso}`);
  }

  getEstadoById(id: number): Observable<Estado> {
    return this.apiService.getDatos(`${this.baseUrl}/${id}`);
  }

  createEstado(estado: Estado): Observable<Estado> {
    return this.apiService.postDatos(`${this.baseUrl}/`, estado).pipe(
      tap(() => {
        this.estadosActualizados.next(true); // Notificar que se creó un nuevo estado
      }),
    );
  }

  getEstadoActualizado(): Observable<boolean> {
    return this.estadosActualizados.asObservable();
  }

  createEstado2(estado: Estado): Observable<Estado> {
    return this.apiService.postDatos(`${this.baseUrl}/`, estado).pipe(
      tap(() => {
        this.estadosActualizados.next(true); // Notificar que se creó un nuevo estado
      }),
    );
  }

  updateEstado(id: number, estado: Estado): Observable<Estado> {
    return this.apiService.putDatos(`${this.baseUrl}/${id}`, estado).pipe(
      tap(() => {
        this.estadosActualizados.next(true);
      }),
    );
  }

  deleteEstado(id: number): Observable<any> {
    return this.apiService.deleteDatos(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.estadosActualizados.next(true);
      }),
    );
  }
}
