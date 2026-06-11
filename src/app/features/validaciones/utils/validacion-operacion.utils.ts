import { OperacionBase } from '../../../models/OperacionBase.models';

export function safeParseJson<T = any>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') {
    return (value as T) ?? fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getTurnoActual(): 'DIA' | 'NOCHE' {
  const hora = new Date().getHours();
  return hora >= 7 && hora < 19 ? 'DIA' : 'NOCHE';
}

export function getFechaActualIso(): string {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, '0');
  const day = String(hoy.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCampoObservacion(revisionActual: number): string {
  if (revisionActual <= 0) return 'observaciones_jefe';
  if (revisionActual === 1) return 'observaciones_jefe2';
  return 'observaciones_jefe3';
}

export function normalizeAprobacionStatus(aprobacion?: number): string {
  if (aprobacion === 1) return 'approved';
  if (aprobacion === 2) return 'rejected';
  return 'pending';
}

export function cloneOperacion<T>(value: T): T {
  return structuredClone(value);
}

export function parseOperacionDetalle(operacion: OperacionBase) {
  return {
    registros: safeParseJson(operacion.registros, Array.isArray(operacion.registros) ? operacion.registros : []),
    horometros: safeParseJson(operacion.horometros, {}),
    condicionesEquipo: safeParseJson(operacion.condiciones_equipo, {}),
    checkList: Array.isArray(operacion.check_list) ? cloneOperacion(operacion.check_list) : [],
    controlLlantas:
      operacion.control_llantas && typeof operacion.control_llantas === 'object'
        ? cloneOperacion(operacion.control_llantas)
        : {},
  };
}

export function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
