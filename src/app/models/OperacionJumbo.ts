export interface OperacionJumbo {
  nivel: string | null; 
  tipo_labor: string;
  labor: string | null;
  ala: string | null;

  tal_prod: number | null;
  tal_rimados: number | null;
  tal_alivio: number | null;
  tal_repaso: number | null;

  long_barras: number;
  num_barras: number;
  tipo_perforacion_id: number;
  tipo_perforacion: string;
  observaciones: string;
  //material?: string;
  //tipo_perforacion_id?: number;

}