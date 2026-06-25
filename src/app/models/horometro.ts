export interface Horometros {
    diesel:    Horometro;
    electrico: Horometro;
    percusion: Horometro;
}
export interface Horometro {
    inicio: number;
    final:  number;
    op:     boolean;
    inop:   boolean;
}
