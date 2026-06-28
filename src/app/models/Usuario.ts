import { Cargo } from "./Cargo";
import { Equipo } from "./Equipo";
import { Proceso } from "./Proceso";

export interface Usuario {
  id?: number;
  codigo_dni: string;
  apellidos: string;
  nombres: string;
  correo?: string;
  rol_nombre: string;
  rol_id?: number;
  cargo?: Cargo;
  cargo_id?: number;
  empresa?: string;
  guardia?: string;
  procesos: Proceso[];
  proceso_ids?: number[];
  //equipo_ids?: number[];
  equipos?: Equipo[];
}
