import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanMetrajeTL } from '../models/PlanMetrajeTL';
import { ApiService } from './api.service';
import { Turno } from '../models/Turno';
import { Periodo } from '../models/Periodo';
import { Labor } from '../models/Labor';
import { Ley } from '../models/Ley';
import { PlanProduccion } from '../models/PlanProduccion';
import { PlanAvanceTH } from '../models/PlanAvanceTH';

export type PlanMetrajeTlPayload = Pick<
  PlanMetrajeTL,
  | 'labor_id'
  | 'periodo_id'
  | 'turno_id'
  | 'ley_id'
  | 'proceso_id'
  | 'dia'
  | 'valor'
>;

export type PlanAvanceTHPayload = Pick<
  PlanAvanceTH,
  | 'labor_id'
  | 'periodo_id'
  | 'turno_id'
  | 'ley_id'
  | 'proceso_id'
  | 'dia'
  | 'valor'
>;

export type PlanProduccionPayload = Pick<
  PlanProduccion,
  | 'labor_id'
  | 'periodo_id'
  | 'turno_id'
  | 'ley_id'
  | 'proceso_id'
  | 'dia'
  | 'valor'
>;

@Injectable({
  providedIn: 'root',
})
export class PlanesService {
  private readonly baseUrlMetrajeTL = 'planes/metraje-tl';
  private readonly baseUrlAvanceTH = 'planes/metraje-avances';
  private readonly baseUrlProduccion = 'planes/produccion';

  constructor(private readonly apiService: ApiService) {}

  getPlanesMetrajeTl(periodoId?: number | null): Observable<PlanMetrajeTL[]> {
    const query = periodoId
      ? `?periodoId=${encodeURIComponent(periodoId)}`
      : '';
    return this.apiService.getDatos(`${this.baseUrlMetrajeTL}${query}`);
  }

  createPlanMetrajeTl(
    payload: PlanMetrajeTlPayload,
  ): Observable<PlanMetrajeTL> {
    return this.apiService.postDatos(`${this.baseUrlMetrajeTL}/`, payload);
  }

  updatePlanMetrajeTl(
    id: number,
    payload: PlanMetrajeTlPayload,
  ): Observable<PlanMetrajeTL> {
    return this.apiService.putDatos(`${this.baseUrlMetrajeTL}/${id}`, payload);
  }

  deletePlanMetrajeTl(id: number): Observable<void> {
    return this.apiService.deleteDatos(`${this.baseUrlMetrajeTL}/${id}`);
  }

  getPlanesAvanceTH(periodoId?: number | null): Observable<PlanAvanceTH[]> {
    const query = periodoId
      ? `?periodoId=${encodeURIComponent(periodoId)}`
      : '';
    return this.apiService.getDatos(`${this.baseUrlAvanceTH}${query}`);
  }

  createPlanAvanceTH(payload: PlanAvanceTHPayload): Observable<PlanAvanceTH> {
    return this.apiService.postDatos(`${this.baseUrlAvanceTH}/`, payload);
  }

  updatePlanAvanceTH(
    id: number,
    payload: PlanAvanceTHPayload,
  ): Observable<PlanAvanceTH> {
    return this.apiService.putDatos(`${this.baseUrlAvanceTH}/${id}`, payload);
  }

  deletePlanAvanceTH(id: number): Observable<void> {
    return this.apiService.deleteDatos(`${this.baseUrlAvanceTH}/${id}`);
  }

  getPlanesProduccion(
    periodoId?: number | null,
  ): Observable<PlanProduccion[]> {
    const query = periodoId
      ? `?periodoId=${encodeURIComponent(periodoId)}`
      : '';
    return this.apiService.getDatos(`${this.baseUrlProduccion}${query}`);
  }

  createPlanProduccion(
    payload: PlanProduccionPayload,
  ): Observable<PlanProduccion> {
    return this.apiService.postDatos(`${this.baseUrlProduccion}/`, payload);
  }

  updatePlanProduccion(
    id: number,
    payload: PlanProduccionPayload,
  ): Observable<PlanProduccion> {
    return this.apiService.putDatos(`${this.baseUrlProduccion}/${id}`, payload);
  }

  deletePlanProduccion(id: number): Observable<void> {
    return this.apiService.deleteDatos(`${this.baseUrlProduccion}/${id}`);
  }

  getLabores(): Observable<Labor[]> {
    return this.apiService.getDatos('planes/labores/');
  }

  getPeriodos(): Observable<Periodo[]> {
    return this.apiService.getDatos('planes/periodos/');
  }

  getTurnos(): Observable<Turno[]> {
    return this.apiService.getDatos('planes/turnos/');
  }

  getLeyes(): Observable<Ley[]> {
    return this.apiService.getDatos('planes/leyes/');
  }
}
