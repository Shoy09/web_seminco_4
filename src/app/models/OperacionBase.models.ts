import { CheckList } from './check-list';
import { ControlLlantas } from './control-llantas';
import { Equipo } from './Equipo';
import { Horometros } from './horometro';
import { OperacionJumbo } from './OperacionJumbo';
import { OperacionScoop } from './OperacionScoop';
import { OperacionSostenimiento } from './OperacionSostenimiento';
import { OperacionTLargos } from './OperacionTLargos';
import { OperacionVolquete } from './OperacionVolquete';
import { Seccion } from './seccion.model';

export interface OperacionBase<TOperacion = TipoOperacionRegistro> {
  id?: number;
  fecha: string;
  turno: string;
  operador: string;
  jefe_guardia: string;
  equipo: Equipo;

  estado?: string;
  envio?: number;
  registros?: Registro<TOperacion>[];

  revisado?: number;
  aprobacion?: number;

  observaciones_jefe?: any;
  observaciones_jefe2?: any;
  observaciones_jefe3?: any;

  seccion?: Seccion;
  capacidad?: string;
  horometros: Horometros;
  condiciones_equipo?: string;
  check_list: CheckList[];
  control_llantas: ControlLlantas;
  programa_trabajo?: string;
}

export interface Registro<TOperacion = TipoOperacionRegistro> {
  id: number;
  numero: number;
  estado: string;
  codigo: string;
  hora_inicio: string;
  hora_final: string | null;
  operacion: TOperacion | null;
}
export type TipoOperacionRegistro =
  | OperacionJumbo
  | OperacionScoop
  | OperacionTLargos
  | OperacionVolquete
  | OperacionSostenimiento;

export type OperacionBaseJumbo = OperacionBase<OperacionJumbo>;
export type OperacionBaseScoop = OperacionBase<OperacionScoop>;
export type OperacionBaseTLargos = OperacionBase<OperacionTLargos>;
export type OperacionBaseSostenimiento = OperacionBase<OperacionSostenimiento>;
export type OperacionBaseVolquete = OperacionBase<OperacionVolquete>;
