export interface OperacionTLargos {
  nivel: string;
  tipo_labor: string;
  labor: string;
  ala: string;
  n_taladros_produccion: number | null;
  metros_perforados_produccion: number | null;
  n_taladros_rimados: number | null;
  metros_perforados_rimados: number | null;
  n_taladros_alivio: number | null;
  metros_perforados_alivio: number | null;
  n_taladros_repaso: number | null;
  metros_perforados_repaso: number | null;
  long_barras: number;
  num_barras: number;
  tipo_perforacion: string;
  tipo_perforacion_id: number;
  observaciones: string | null;
}
