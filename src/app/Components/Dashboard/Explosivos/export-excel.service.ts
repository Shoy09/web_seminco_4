import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { NubeDatosTrabajoExploraciones, Retardo } from '../../../models/nube-datos-trabajo-exploraciones';
import { Explosivo } from '../../../models/Explosivo';
import { Accesorio } from '../../../models/Accesorio';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {
  
  constructor() { }

  /**
   * Exporta datos de explosivos a Excel
   * @param datos Los datos a exportar
   * @param explosivos Lista de explosivos para clasificación
   * @param accesorios Lista de accesorios para clasificación
   * @param nombreArchivo Nombre del archivo (opcional)
   */
  exportarExplosivosAExcel(
    datos: NubeDatosTrabajoExploraciones[],
    explosivos: Explosivo[],
    accesorios: Accesorio[],
    nombreArchivo: string = 'BD_Explosivos.xlsx'
  ): void {
    const workbook = XLSX.utils.book_new();
    
    // Obtener los datos ordenados
    const { data: excelDataDetalle, headers: materialHeaders } = this.prepararDatosParaExcel(datos, explosivos, accesorios);
    const excelDataConsumo = this.prepararDatosParaConsumo(datos, explosivos, accesorios);
    
    // Crear hojas de trabajo
    const worksheetDetalle = XLSX.utils.json_to_sheet(excelDataDetalle);
    const worksheetConsumo = XLSX.utils.json_to_sheet(excelDataConsumo);
    
    // Añadir hojas al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheetConsumo, 'CONSUMO EXPLOSIVOS');
    XLSX.utils.book_append_sheet(workbook, worksheetDetalle, 'EXPLOSIVOS - DETALLE');
    
    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(workbook, nombreArchivo);
  }

  private esExplosivo(nombreMaterial: string, explosivos: Explosivo[]): boolean {
    return explosivos.some(exp => exp.tipo_explosivo === nombreMaterial);
  }

  private esAccesorio(nombreMaterial: string, accesorios: Accesorio[]): boolean {
    return accesorios.some(acc => acc.tipo_accesorio === nombreMaterial);
  }

  private ordenarMateriales(materiales: string[], explosivos: Explosivo[], accesorios: Accesorio[]): string[] {
    const explosivosList = materiales.filter(m => this.esExplosivo(m, explosivos)).sort((a, b) => a.localeCompare(b));
    const accesoriosList = materiales.filter(m => this.esAccesorio(m, accesorios)).sort((a, b) => a.localeCompare(b));
    return [...explosivosList, ...accesoriosList];
  }

  /**
   * Formatea el nombre de la columna para Excel
   * @param tipo "Milisegundo" o "Medio Segundo"
   * @param codigo Código del retardo (ej: "001", "00004")
   * @param longitud Longitud en metros (ej: 18, 4.2)
   * @returns Nombre formateado: "MLS-001 (18m)" o "MDS-00004 (4.2m)"
   */
  private formatearNombreColumna(tipo: string, codigo: string, longitud: number): string {
    const prefijo = tipo === 'Milisegundo' ? 'MLS' : 'MDS';
    // Formatear la longitud: si es entero mostrar sin decimales, si no mostrar con 1 decimal
    const longitudFormateada = Number.isInteger(longitud) ? longitud : longitud.toFixed(1);
    return `${prefijo}-${codigo} (${longitudFormateada}m)`;
  }

  /**
   * Obtiene todas las columnas únicas de retardos basadas en tipo y longitud
   */
  private obtenerColumnasRetardos(datos: NubeDatosTrabajoExploraciones[]): Set<string> {
    const columnas = new Set<string>();
    
    datos.forEach(dato => {
      // Procesar despachos
      dato.despachos.forEach(despacho => {
        despacho.detalles_explosivos?.forEach(detalle => {
          const retardos: Retardo[] = JSON.parse(detalle.retardos);
          
          retardos.forEach(retardo => {
            const nombreColumna = this.formatearNombreColumna(detalle.tipo, retardo.codigo, detalle.longitud);
            columnas.add(nombreColumna);
          });
        });
      });
      
      // Procesar devoluciones
      dato.devoluciones.forEach(devolucion => {
        devolucion.detalles_explosivos?.forEach(detalle => {
          const retardos: Retardo[] = JSON.parse(detalle.retardos);
          
          retardos.forEach(retardo => {
            const nombreColumna = this.formatearNombreColumna(detalle.tipo, retardo.codigo, detalle.longitud);
            columnas.add(nombreColumna);
          });
        });
      });
    });
    
    return columnas;
  }

  private prepararDatosParaConsumo(
    datos: NubeDatosTrabajoExploraciones[],
    explosivos: Explosivo[],
    accesorios: Accesorio[]
  ): any[] {
    const consumoData: any[] = [];
    const materialHeaders = new Set<string>();
    const columnasRetardos = this.obtenerColumnasRetardos(datos);
    
    // Recolectar todos los nombres de materiales únicos
    datos.forEach((dato) => {
      dato.despachos.forEach((despacho) => {
        despacho.detalles.forEach((detalle) => {
          materialHeaders.add(detalle.nombre_material);
        });
      });
      
      dato.devoluciones.forEach((devolucion) => {
        devolucion.detalles.forEach((detalle) => {
          materialHeaders.add(detalle.nombre_material);
        });
      });
    });

    const materialesOrdenados = this.ordenarMateriales(Array.from(materialHeaders), explosivos, accesorios);
    const todasLasColumnas = [...materialesOrdenados, ...Array.from(columnasRetardos).sort()];

    datos.forEach((dato) => {
      const row = this.crearFilaBaseConsumo(dato, todasLasColumnas);
      this.procesarConsumos(dato, row, new Set(materialesOrdenados), columnasRetardos);
      consumoData.push(row);
    });
    
    return consumoData;
  }

  private prepararDatosParaExcel(
    datos: NubeDatosTrabajoExploraciones[],
    explosivos: Explosivo[],
    accesorios: Accesorio[]
  ): { data: any[], headers: string[] } {
    const excelData: any[] = [];
    const materialHeaders = new Set<string>();
    const columnasRetardos = this.obtenerColumnasRetardos(datos);
    
    // Recolectar todos los nombres de materiales únicos
    datos.forEach((dato) => {
      dato.despachos.forEach((despacho) => {
        despacho.detalles.forEach((detalle) => {
          materialHeaders.add(detalle.nombre_material);
        });
      });
      
      dato.devoluciones.forEach((devolucion) => {
        devolucion.detalles.forEach((detalle) => {
          materialHeaders.add(detalle.nombre_material);
        });
      });
    });

    const materialesOrdenados = this.ordenarMateriales(Array.from(materialHeaders), explosivos, accesorios);
    const todasLasColumnas = [...materialesOrdenados, ...Array.from(columnasRetardos).sort()];

    datos.forEach((dato) => {
      // Procesar despachos
      dato.despachos.forEach((despacho) => {
        const row = this.crearFilaBase(dato, todasLasColumnas);
        row['VALE'] = 'DESPACHO';
        row['OBSERVACIONES'] = despacho.observaciones || '';
        
        // Procesar los nuevos detalles_explosivos
        despacho.detalles_explosivos?.forEach((detalle) => {
          const retardos: Retardo[] = JSON.parse(detalle.retardos);
          
          retardos.forEach(retardo => {
            const nombreColumna = this.formatearNombreColumna(detalle.tipo, retardo.codigo, detalle.longitud);
            row[nombreColumna] = (row[nombreColumna] || 0) + retardo.cantidad;
          });
        });
        
        // Procesar otros materiales
        despacho.detalles.forEach((detalle) => {
          row[detalle.nombre_material] = detalle.cantidad;
        });
        
        excelData.push(row);
      });
      
      // Procesar devoluciones
      dato.devoluciones.forEach((devolucion) => {
        const row = this.crearFilaBase(dato, todasLasColumnas);
        row['VALE'] = 'DEVOLUCIÓN';
        row['OBSERVACIONES'] = devolucion.observaciones || '';
        
        // Procesar los nuevos detalles_explosivos
        devolucion.detalles_explosivos?.forEach((detalle) => {
          const retardos: Retardo[] = JSON.parse(detalle.retardos);
          
          retardos.forEach(retardo => {
            const nombreColumna = this.formatearNombreColumna(detalle.tipo, retardo.codigo, detalle.longitud);
            row[nombreColumna] = (row[nombreColumna] || 0) + retardo.cantidad;
          });
        });
        
        // Procesar otros materiales
        devolucion.detalles.forEach((detalle) => {
          row[detalle.nombre_material] = detalle.cantidad;
        });
        
        excelData.push(row);
      });
    });
    
    return { data: excelData, headers: todasLasColumnas };
  }

  private crearFilaBaseConsumo(dato: NubeDatosTrabajoExploraciones, todasLasColumnas: string[]): any {
    const row: any = {
      'ID': dato.id,
      'FECHA': dato.fecha,
      'TURNO': dato.turno,
      'SEMANA': dato.semanaSelect || dato.semanaDefault || '',
      'EMPRESA': dato.empresa || '',
      'ZONA': dato.zona,
      'TIPO DE LABOR': dato.tipo_labor,
      'LABOR': dato.labor,
      'ALA': dato.ala || '',
      'VETA': dato.veta,
      'SECCION': dato.seccion,
      'NIVEL': dato.nivel,
      'TIPO DE PERFORACIÓN': dato.tipo_perforacion,
      'N° TALADROS DISPARADOS': dato.taladro,
      'PIES POR TALADRO': dato.pies_por_taladro
    };

    // Inicializar todas las columnas dinámicas en 0
    todasLasColumnas.forEach(columna => {
      row[columna] = 0;
    });

    return row;
  }

  private crearFilaBase(dato: NubeDatosTrabajoExploraciones, todasLasColumnas: string[]): any {
    const row: any = {
      'ID': dato.id,
      'FECHA': dato.fecha,
      'TURNO': dato.turno,
      'SEMANA': dato.semanaSelect || dato.semanaDefault || '',
      'EMPRESA': dato.empresa || '',
      'ZONA': dato.zona,
      'TIPO DE LABOR': dato.tipo_labor,
      'LABOR': dato.labor,
      'ALA': dato.ala || '',
      'VETA': dato.veta,
      'SECCION': dato.seccion,
      'NIVEL': dato.nivel,
      'TIPO DE PERFORACIÓN': dato.tipo_perforacion,
      'N° TALADROS DISPARADOS': dato.taladro,
      'PIES POR TALADRO': dato.pies_por_taladro
    };

    // Inicializar todas las columnas dinámicas vacías
    todasLasColumnas.forEach(columna => {
      row[columna] = '';
    });

    row['VALE'] = '';
    row['OBSERVACIONES'] = '';

    return row;
  }

  private procesarConsumos(
    dato: NubeDatosTrabajoExploraciones, 
    row: any, 
    materialHeaders: Set<string>,
    columnasRetardos: Set<string>
  ) {
    const despachosMateriales: {[key: string]: number} = {};
    const devolucionesMateriales: {[key: string]: number} = {};
    const despachosRetardos: {[key: string]: number} = {};
    const devolucionesRetardos: {[key: string]: number} = {};

    // Inicializar contadores
    materialHeaders.forEach(header => {
      despachosMateriales[header] = 0;
      devolucionesMateriales[header] = 0;
    });

    columnasRetardos.forEach(columna => {
      despachosRetardos[columna] = 0;
      devolucionesRetardos[columna] = 0;
    });

    // Procesar DESPACHOS
    dato.despachos.forEach(despacho => {
      // Materiales normales
      despacho.detalles.forEach(detalle => {
        const cantidad = parseFloat(detalle.cantidad) || 0;
        despachosMateriales[detalle.nombre_material] += cantidad;
      });

      // Nuevos detalles_explosivos con retardos
      despacho.detalles_explosivos?.forEach(detalle => {
        const retardos: Retardo[] = JSON.parse(detalle.retardos);
        
        retardos.forEach(retardo => {
          const nombreColumna = this.formatearNombreColumna(detalle.tipo, retardo.codigo, detalle.longitud);
          despachosRetardos[nombreColumna] = (despachosRetardos[nombreColumna] || 0) + retardo.cantidad;
        });
      });
    });

    // Procesar DEVOLUCIONES
    dato.devoluciones.forEach(devolucion => {
      // Materiales normales
      devolucion.detalles.forEach(detalle => {
        const cantidad = parseFloat(detalle.cantidad) || 0;
        devolucionesMateriales[detalle.nombre_material] += cantidad;
      });

      // Nuevos detalles_explosivos con retardos
      devolucion.detalles_explosivos?.forEach(detalle => {
        const retardos: Retardo[] = JSON.parse(detalle.retardos);
        
        retardos.forEach(retardo => {
          const nombreColumna = this.formatearNombreColumna(detalle.tipo, retardo.codigo, detalle.longitud);
          devolucionesRetardos[nombreColumna] = (devolucionesRetardos[nombreColumna] || 0) + retardo.cantidad;
        });
      });
    });

    // Calcular consumos finales (Despachos - Devoluciones)
    materialHeaders.forEach(header => {
      row[header] = despachosMateriales[header] - devolucionesMateriales[header];
    });

    columnasRetardos.forEach(columna => {
      row[columna] = (despachosRetardos[columna] || 0) - (devolucionesRetardos[columna] || 0);
    });
  }
}