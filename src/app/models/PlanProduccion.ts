export interface PlanProduccion {
    planProduccionId: number;
    labor_id:         number;
    periodo_id:       number;
    turno_id:         number;
    ley_id:           number;
    proceso_id:       number;
    proceso_nombre:   string;
    dia:              number;
    valor:            number;
    labor_nombre:     string;
    turno_nombre:     string;
    ley_nombre:       string;
    created_at:       Date;
    updated_at:       Date;
}