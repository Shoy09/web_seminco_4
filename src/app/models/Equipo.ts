export interface Equipo {
  id: number;
  nombre: string;
  proceso: string;
  codigo: string;
  marca: string;
  modelo: string;
  serie: string;
  anioFabricacion: number;
  fechaIngreso: Date;
  capacidadYd3?: number | null;
  capacidadM3?: number | null;
  proceso_id: number;
  horometros?: EquipoHorometro[];
  horometro_ids?: number[];
}
export interface EquipoHorometro {
  id: number;
  nombre: string;
}
