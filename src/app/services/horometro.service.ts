import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipoHorometro } from '../models/Equipo';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HorometroService {
  private baseUrl = 'tipo-horometro';

  constructor(private apiService: ApiService) {}

  getHorometros(): Observable<EquipoHorometro[]> {
    return this.apiService.getDatos<EquipoHorometro[]>(`${this.baseUrl}`);
  }
}
