export interface CheckList {
    descripcion: string;
    decision:    number;
    observacion: string;
    categoria:   Categoria;
}
export enum Categoria {
    CHECKLISTAntesDeArrancarElEquipo = "CHECK LIST (Antes de arrancar el equipo)",
    MPFMantenimientoPreventivoFinal = "MPF (Mantenimiento Preventivo Final)",
    MPIMantenimientoPrevioInicial = "MPI (Mantenimiento Previo Inicial)",
    VERIFICAREnFuncionamiento = "VERIFICAR (En Funcionamiento)",
}