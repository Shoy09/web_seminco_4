// Nueva interfaz para los retardos
export interface Retardo {
  numero: number;
  codigo: string;
  cantidad: number;
}

// Nueva interfaz para detalles_explosivos (ahora con la nueva estructura)
export interface NubeDetalleDespachoExplosivos {
  id: number;
  id_despacho: number;
  tipo: string;        // "Milisegundo" o "Medio Segundo"
  longitud: number;    // ej: 18, 4.2
  retardos: string;    // JSON string que parsearemos a Retardo[]
  createdAt?: string;
  updatedAt?: string;
}

export interface NubeDespachoDetalle {
  id: number;
  nombre_material: string;
  cantidad: string;
}

export interface NubeDespacho {
  id: number;
  observaciones?: string;
  detalles: NubeDespachoDetalle[];
  detalles_explosivos: NubeDetalleDespachoExplosivos[];  // Actualizado
  // NOTA: Ya no usamos mili_segundo, medio_segundo
}

// Nueva interfaz para devoluciones explosivos
export interface NubeDetalleDevolucionesExplosivos {
  id: number;
  id_devolucion: number;
  tipo: string;        // "Milisegundo" o "Medio Segundo"
  longitud: number;    // ej: 18, 4.2
  retardos: string;    // JSON string que parsearemos a Retardo[]
  createdAt?: string;
  updatedAt?: string;
}

export interface NubeDevolucionDetalle {
  id: number;
  nombre_material: string;
  cantidad: string;
}

export interface NubeDevoluciones {
  id: number;
  observaciones?: string;
  detalles: NubeDevolucionDetalle[];
  detalles_explosivos: NubeDetalleDevolucionesExplosivos[];  // Actualizado
  // NOTA: Ya no usamos mili_segundo, medio_segundo
}

export interface NubeDatosTrabajoExploraciones {
  id: number;
  fecha: string;
  turno: string;
  taladro: string;
  pies_por_taladro: string;
  zona: string;
  tipo_labor: string;
  labor: string;
  ala?: string;
  veta: string;
  nivel: string;
  tipo_perforacion: string;
  estado: string;
  cerrado: number;
  envio?: number;
  semanaDefault?: string;
  semanaSelect?: string;
  empresa?: string;
  seccion: string;
  despachos: NubeDespacho[];
  devoluciones: NubeDevoluciones[];
}