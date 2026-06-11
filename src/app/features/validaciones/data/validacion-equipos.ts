export interface ValidacionEquipoConfig {
  slug: string;
  nombre: string;
  descripcion: string;
  tipoApi: string;
  icono: string;
  gradiente: string;
  stringifyRegistrosOnSave?: boolean;
}

export const VALIDACION_EQUIPOS: ValidacionEquipoConfig[] = [
  {
    slug: 'tal-horizontal',
    nombre: 'Perforacion Horizontal',
    descripcion: 'Revision operativa de jumbos y sus registros por turno.',
    tipoApi: 'tal_horizontal',
    icono: 'pi pi-directions',
    gradiente: 'from-cyan-600 via-sky-600 to-indigo-700',
    stringifyRegistrosOnSave: true,
  },
  {
    slug: 'tal-largo',
    nombre: 'Taladros Largos',
    descripcion: 'Validacion de perforacion larga, horas, horometros y checklist.',
    tipoApi: 'tal_largo',
    icono: 'pi pi-compass',
    gradiente: 'from-blue-700 via-indigo-700 to-violet-700',
    stringifyRegistrosOnSave: true,
  },
  {
    slug: 'empernador',
    nombre: 'Empernador',
    descripcion: 'Control de sostenimiento, condiciones de equipo y aprobacion.',
    tipoApi: 'empernador',
    icono: 'pi pi-cog',
    gradiente: 'from-rose-600 via-red-600 to-orange-600',
  },
  {
    slug: 'scooptram',
    nombre: 'Scooptram',
    descripcion: 'Validacion de carguio, operaciones y presion de llantas.',
    tipoApi: 'carguio',
    icono: 'pi pi-truck',
    gradiente: 'from-slate-700 via-slate-600 to-zinc-700',
    stringifyRegistrosOnSave: true,
  },
  {
    slug: 'scissor',
    nombre: 'Scissor',
    descripcion: 'Revision de trabajos auxiliares, tiempos y condicion operativa.',
    tipoApi: 'scissor',
    icono: 'pi pi-wrench',
    gradiente: 'from-amber-500 via-orange-500 to-red-500',
  },
  {
    slug: 'scalamin',
    nombre: 'Scalamin',
    descripcion: 'Seguimiento de saneo, checklist y revision del equipo.',
    tipoApi: 'scalamin',
    icono: 'pi pi-shield',
    gradiente: 'from-emerald-600 via-teal-600 to-cyan-700',
  },
  {
    slug: 'anfochanger',
    nombre: 'Anfocharger',
    descripcion: 'Validacion de carga explosiva y controles de seguridad.',
    tipoApi: 'anfochanger',
    icono: 'pi pi-bolt',
    gradiente: 'from-fuchsia-600 via-purple-600 to-violet-700',
  },
];

export function getValidacionEquipoConfig(
  slug: string | null | undefined,
): ValidacionEquipoConfig | undefined {
  return VALIDACION_EQUIPOS.find((equipo) => equipo.slug === slug);
}
