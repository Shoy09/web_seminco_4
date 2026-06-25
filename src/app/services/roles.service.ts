import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Rol } from '../models/Rol';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private baseUrl = 'roles';

  constructor(private apiService: ApiService) {}

  getRoles(): Observable<Rol[]> {
    return this.apiService.getDatos<Rol[]>(this.baseUrl);
  }
}
