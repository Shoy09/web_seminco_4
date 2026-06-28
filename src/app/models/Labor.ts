export interface Labor {
    laborId:                   number;
    mina_id:                   number;
    zona_id:                   number;
    area_id:                   number;
    fase_id:                   number;
    tipo_labor_id:             number;
    estructura_mineral_id:     number;
    nivel_id:                  number;
    ala_id:                    number;
    nombre_labor:              string;
    estado:                    string;
    mina_nombre:               string;
    zona_nombre:               string;
    area_nombre:               string;
    fase_nombre:               string;
    tipo_labor_nombre:         string;
    estructura_mineral_nombre: string;
    nivel_nombre:              string;
    ala_nombre:                string;
    created_at:                Date;
    updated_at:                Date;
    created_by:                null;
    updated_by:                null;
}
