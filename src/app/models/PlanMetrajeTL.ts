export interface PlanMetrajeTL {
   planMetrajeTlId:           number;
    labor_id:                  number;
    periodo_id:                number;
    proceso_id:                number;
    proceso_nombre:            string;
    ancho_veta_metros:         number;
    ancho_minado_sem_metros:   number;
    ancho_minado_mes_metros:   number;
    mina_id:                   number;
    zona_id:                   number;
    area_id:                   number;
    fase_id:                   number;
    tipo_labor_id:             number;
    estructura_mineral_id:     number;
    nivel_id:                  number;
    ala_id:                    number | null;
    labor_nombre:              string;
    mina_nombre:               string;
    zona_nombre:               string;
    area_nombre:               string;
    fase_nombre:               string;
    tipo_labor_nombre:         string;
    estructura_mineral_nombre: string;
    nivel_nombre:              string;
    ala_nombre:                null | string;
    created_at:                Date;
    updated_at:                Date;
  }
  