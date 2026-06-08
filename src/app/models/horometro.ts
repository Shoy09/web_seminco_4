export interface Horometros {
    diesel:    Diesel;
    electrico: Diesel;
    percusion: Diesel;
}
export interface Diesel {
    inicio: number;
    final:  number;
    op:     boolean;
    inop:   boolean;
}
