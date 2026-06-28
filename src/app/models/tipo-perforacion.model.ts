export interface TipoPerforacion {
  id: number;
  nombre: string;
  proceso_id?: number;
  proceso: string;
  permitido_medicion: number;
}
