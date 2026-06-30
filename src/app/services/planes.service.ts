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

export type PlanMetrajeTlPayload = {
  anio: number;
  mes: string;
  semana: string;
  mina: string;
  zona: string;
  area: string;
  fase: string;
  tipo_minado: string;
  tipo_labor: string;
  estructura_mineralizada: string;
  nivel: string;
  nombre_labor: string;
  ala: string;
  ancho_veta_metros: number;
  ancho_minado_sem_metros: number;
};

export interface PlanImportResult {
  processed_rows: number;
  updated_rows: number;
  skipped_rows: number;
  errors: string[];
}

export type PlanAvanceTHPayload = Pick<
  PlanAvanceTH,
  | 'labor_id'
  | 'periodo_id'
  | 'proceso_id'
  | 'avance_metros'
  | 'ancho_metros'
  | 'alto_metros'
  | 'tms'
>;

export type PlanProduccionPayload = {
  anio: number;
  mes: string;
  semana: string;
  mina: string;
  zona: string;
  area: string;
  fase: string;
  tipo_minado: string;
  tipo_labor: string;
  estructura_mineralizada: string;
  nivel: string;
  nombre_labor: string;
  ala: string;
  ancho_veta_metros: number;
  ancho_minado_sem_metros: number;
  ancho_minado_mes_metros: number;
  ag_gr: number;
  porcentaje_cu: number;
  porcentaje_pb: number;
  porcentaje_zn: number | null;
  vpt_actual: number;
  vpt_final: number;
  cut_off_1: number;
  cut_off_2: number;
};

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

  importarExcelPlanMetrajeTl(file: File): Observable<PlanImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.postFormData(`${this.baseUrlMetrajeTL}/import`, formData);
  }
  importarExcelPlanAvanceTH(file: File): Observable<PlanImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.postFormData(`${this.baseUrlAvanceTH}/import`, formData);
  }
  importarExcelPlanProduccion(file: File): Observable<PlanImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.postFormData(`${this.baseUrlProduccion}/import`, formData);
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
