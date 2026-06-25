import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Cargo } from '../models/Cargo';

@Injectable({
  providedIn: 'root'
})
export class CargosService {
  private baseUrl = 'cargos';

  constructor(private apiService: ApiService) {}

  getCargos(): Observable<Cargo[]> {
    return this.apiService.getDatos<Cargo[]>(this.baseUrl);
  }
}
