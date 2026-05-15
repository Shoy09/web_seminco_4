export interface Accesorio {
    id?: number;  // Opcional, porque al crear no se envía
    codigo: string;
    tipo_accesorio: string;
    costo: number; // Costo en $/pieza o $/m
    unidad_medida: string;
}
