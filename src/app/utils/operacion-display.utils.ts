import { Equipo } from '../models/Equipo';
import { OperacionBase } from '../models/OperacionBase.models';
import { Seccion } from '../models/seccion.model';

function limpiarTexto(value: string | null | undefined): string {
  return String(value || '').trim();
}

export function getEquipoNombre(equipo?: Equipo | string | null): string {
  if (typeof equipo === 'string') {
    return limpiarTexto(equipo) || 'SIN_EQUIPO';
  }

  return (
    limpiarTexto(equipo?.nombre) ||
    limpiarTexto(equipo?.codigo) ||
    limpiarTexto(equipo?.modelo) ||
    'SIN_EQUIPO'
  );
}

export function getEquipoModelo(equipo?: Equipo | string | null): string {
  if (typeof equipo === 'string') {
    return limpiarTexto(equipo) || 'SIN_EQUIPO';
  }

  return (
    limpiarTexto(equipo?.modelo) ||
    limpiarTexto(equipo?.nombre) ||
    limpiarTexto(equipo?.codigo) ||
    'SIN_EQUIPO'
  );
}

export function getEquipoCodigo(equipo?: Equipo | string | null): string {
  if (typeof equipo === 'string') {
    return limpiarTexto(equipo) || 'SIN_CODIGO';
  }

  return (
    limpiarTexto(equipo?.codigo) ||
    limpiarTexto(equipo?.nombre) ||
    limpiarTexto(equipo?.modelo) ||
    'SIN_CODIGO'
  );
}

export function getOperacionEquipoNombre(
  operacion?: Pick<OperacionBase, 'equipo'> | null,
): string {
  return getEquipoNombre(operacion?.equipo);
}

export function getOperacionEquipoModelo(
  operacion?: Pick<OperacionBase, 'equipo'> | null,
): string {
  return getEquipoModelo(operacion?.equipo);
}

export function getOperacionEquipoCodigo(
  operacion?: Pick<OperacionBase, 'equipo'> | null,
): string {
  return getEquipoCodigo(operacion?.equipo);
}

export function getSeccionNombre(
  seccion?: Seccion | string | null,
  fallback: string = 'SIN_SECCION',
): string {
  if (typeof seccion === 'string') {
    return limpiarTexto(seccion) || fallback;
  }

  return limpiarTexto(seccion?.nombre) || fallback;
}
