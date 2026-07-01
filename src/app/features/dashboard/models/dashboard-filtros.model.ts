export type TipoFiltroDashboard = 'anio' | 'mes' | 'semana' | 'dia' | 'rango';

export interface OpcionFiltroDashboard {
  label: string;
  value: TipoFiltroDashboard;
}

export interface FiltrosDashboard {
  tipoFiltro: TipoFiltroDashboard;
  anioSeleccionado: Date | null;
  mesSeleccionado: Date | null;
  semanaSeleccionada: Date | null;
  diaSeleccionado: Date | null;
  rangoFechas: Date[] | null;
  turnoSeleccionado: string | null;
  turnoIdSeleccionado: number | null;
}
