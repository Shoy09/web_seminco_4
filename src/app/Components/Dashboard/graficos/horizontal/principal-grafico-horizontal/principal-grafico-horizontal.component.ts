import { Component, OnInit } from '@angular/core';
import { AvanceFaseComponent } from '../Graficos components/Hoja 1/avance-fase/avance-fase.component';
import { DemorasOperativasComponent } from '../Graficos components/Hoja 1/demoras-operativas/demoras-operativas.component';
import { DisparosDiaComponent } from '../Graficos components/Hoja 1/disparos-dia/disparos-dia.component';
import { DisparosEquipoComponent } from '../Graficos components/Hoja 1/disparos-equipo/disparos-equipo.component';
import { HorasDeMantenimientoComponent } from '../Graficos components/Hoja 1/horas-de-mantenimiento/horas-de-mantenimiento.component';
import { HorasNoOperativasComponent } from '../Graficos components/Hoja 1/horas-no-operativas/horas-no-operativas.component';
import { HorometrosJumbosComponent } from '../Graficos components/Hoja 1/horometros-jumbos/horometros-jumbos.component';
import { MetrosPerforadosDisparoComponent } from '../Graficos components/Hoja 1/metros-perforados-disparo/metros-perforados-disparo.component';
import { MhrEquipoComponent } from '../Graficos components/Hoja 1/mhr-equipo/mhr-equipo.component';
import { PerforadoEquipoComponent } from '../Graficos components/Hoja 1/perforado-equipo/perforado-equipo.component';
import { RendimientoEquipoComponent } from '../Graficos components/Hoja 1/rendimiento-equipo/rendimiento-equipo.component';
import { ResumenComponent } from '../Graficos components/Hoja 1/resumen/resumen.component';
import { HorasInicioPerforacionComponent } from "../Graficos components/Hoja 2/horas-inicio-perforacion/horas-inicio-perforacion.component";

import { PlanMensualService } from '../../../../../services/plan-mensual.service';
import { FechasPlanMensualService } from '../../../../../services/fechas-plan-mensual.service';
import { OperacionesService } from '../../../../../services/operaciones.service';

import { OperacionBase } from '../../../../../models/OperacionBase.models';
import { PlanMensual } from '../../../../../models/plan-mensual.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-principal-grafico-horizontal',
  imports: [
    AvanceFaseComponent, ResumenComponent, DisparosEquipoComponent,
    DisparosDiaComponent, RendimientoEquipoComponent, DemorasOperativasComponent,
    HorasNoOperativasComponent, HorasDeMantenimientoComponent,
    MetrosPerforadosDisparoComponent, PerforadoEquipoComponent,
    MhrEquipoComponent, HorometrosJumbosComponent, HorasInicioPerforacionComponent,
    FormsModule 
  ],
  templateUrl: './principal-grafico-horizontal.component.html',
  styleUrl: './principal-grafico-horizontal.component.css'
})
export class PrincipalGraficoHorizontalComponent implements OnInit {

  anio!: number;
  mes!: string;

  // DATA ORIGINAL (sin filtrar)
  operacionesOriginal: OperacionBase[] = [];
  operacionesFiltradas: OperacionBase[] = [];
  planesMensuales: PlanMensual[] = [];

  // 🔥 DATA FINAL PARA LOS GRAFICOS
  dataAvanceFase: any[] = [];
  dataDisparosEquipo: any[] = [];  // 👈 NUEVO

  // Variables para el filtro de fechas
  fechaInicio: string = '';
  fechaFin: string = '';

  resumen = {
    conteoEquipos: 0,
    metrosPorDisparo: 0,
    nFrentes: 0,
    totalMetros: 0
  };

  constructor(
    private planMensualService: PlanMensualService,
    private fechasPlanMensualService: FechasPlanMensualService,
    private operacionesService: OperacionesService
  ) {}

  ngOnInit(): void {
    this.obtenerUltimaFecha();
    this.cargarOperaciones();
  }

  // =========================================
  // 🔥 OPERACIONES
  // =========================================
  cargarOperaciones() {
    const tipo = 'tal_horizontal';

    this.operacionesService.getAll(tipo).subscribe({
      next: (resp) => {
        this.operacionesOriginal = resp.data;
        this.operacionesFiltradas = [...this.operacionesOriginal];
        console.log('🔥 DATA OPERACIONES:', this.operacionesOriginal);

        this.procesarTodo();
      },
      error: (err) => {
        console.error('❌ Error al obtener operaciones:', err);
      }
    });
  }

  // =========================================
  // 🔥 FILTRO POR FECHA
  // =========================================
  aplicarFiltro() {
    if (!this.fechaInicio || !this.fechaFin) {
      console.warn('⚠️ Debes seleccionar ambas fechas');
      return;
    }

    this.operacionesFiltradas = this.operacionesOriginal.filter(operacion => {
      if (!operacion.fecha) return false;
      const fechaOperacion = operacion.fecha;
      return fechaOperacion >= this.fechaInicio && fechaOperacion <= this.fechaFin;
    });

    console.log('📅 Filtrando por fechas:', this.fechaInicio, 'a', this.fechaFin);
    console.log('📊 Operaciones originales:', this.operacionesOriginal.length);
    console.log('📊 Operaciones filtradas:', this.operacionesFiltradas.length);

    this.procesarTodo();
  }

  quitarFiltro() {
    this.operacionesFiltradas = [...this.operacionesOriginal];
    this.fechaInicio = '';
    this.fechaFin = '';
    
    console.log('🔄 Filtro eliminado, restaurando datos originales');
    console.log('📊 Operaciones:', this.operacionesFiltradas.length);
    
    this.procesarTodo();
  }

  // =========================================
  // 🔥 PLAN
  // =========================================
  obtenerUltimaFecha(): void {
    this.fechasPlanMensualService.getUltimaFecha().subscribe({
      next: (ultimaFecha) => {
        const anio: number | undefined = ultimaFecha.fecha_ingreso;
        const mes: string = ultimaFecha.mes;

        if (anio !== undefined) {
          this.anio = anio;
          this.mes = mes.trim().toUpperCase();

          this.obtenerPlanesMensuales(this.anio, this.mes);
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener la última fecha:', error);
      }
    });
  }

  obtenerPlanesMensuales(anio: number, mes: string): void {
    this.planMensualService.getPlanMensualByYearAndMonth(anio, mes).subscribe({
      next: (planes) => {
        this.planesMensuales = planes;
        console.log('🔥 PLANES MENSUALES:', this.planesMensuales);

        this.procesarTodo();
      },
      error: (error) => {
        console.error('❌ Error al obtener planes mensuales:', error);
      }
    });
  }

  // =========================================
  // 🔥 PROCESAMIENTO TOTAL
  // =========================================
  procesarTodo() {
    if (!this.operacionesFiltradas.length || !this.planesMensuales.length) return;

    this.dataAvanceFase = this.procesarAvanceFase();
    this.dataDisparosEquipo = this.procesarDisparosEquipo();  // 👈 NUEVO
    this.procesarResumen();

    console.log('🔥 DATA DISPAROS EQUIPO:', this.dataDisparosEquipo);
  }

  // =========================================
  // 🔥 CALCULO DE FRENTES COMPLETOS
  // =========================================
  contarFrentesCompletos(registrosArray: any[]): number {
    if (!Array.isArray(registrosArray)) return 0;
    
    let contador = 0;
    for (const registro of registrosArray) {
      if (registro.estado === 'OPERATIVO') {
        const operacion = registro.operacion || registro;
        if (operacion.tipo_perforacion === 'FRENTE COMPLETO') {
          contador++;
        }
      }
    }
    return contador;
  }

  // =========================================
  // 🔥 OBTENER SECCION DEL PLAN
  // =========================================
  obtenerSeccionDelPlan(area: string): string {
    const plan = this.planesMensuales.find(p => p.area === area);
    if (plan && plan.ancho_m !== undefined && plan.alto_m !== undefined) {
      return `${plan.ancho_m}x${plan.alto_m}`;
    }
    return '';
  }

  // =========================================
  // 🔥 DATA PARA GRAFICO DISPAROS EQUIPO
  // =========================================
  procesarDisparosEquipo() {
    const mapaDisparos = new Map<string, {
      modelo_equipo: string,
      seccion_labor: string,  // 👈 Cambiado de 'seccion' a 'seccion_labor'
      seccion: string, 
      n_frentes: number
    }>();

    this.operacionesFiltradas.forEach(op => {
      try {
        const registrosArray = op.registros;
        
        if (Array.isArray(registrosArray) && registrosArray.length > 0) {
          // Obtener área del primer registro
          const primerRegistro = registrosArray[0];
          const area = primerRegistro?.operacion?.area || primerRegistro?.area || '';
          
          // Obtener sección del plan
          const seccionLabor = this.obtenerSeccionDelPlan(area);  // 👈 Cambiado nombre variable
          
          // Contar frentes completos
          const nFrentes = this.contarFrentesCompletos(registrosArray);
          
          // Usar modelo_equipo como clave única
          const key = op.modelo_equipo || 'SIN_EQUIPO';
          
          
          if (mapaDisparos.has(key)) {
            // Acumular frentes si ya existe
            const existing = mapaDisparos.get(key)!;
            existing.n_frentes += nFrentes;
          } else {
            // Crear nueva entrada
            mapaDisparos.set(key, {
              modelo_equipo: op.modelo_equipo || 'SIN_EQUIPO',
              seccion: op.seccion || 'SIN_SECCION',  // 👈 Cambiado a 'seccion'
              seccion_labor: seccionLabor,  // 👈 Cambiado a 'seccion_labor'
              n_frentes: nFrentes
            });
          }
        }
        
      } catch (error) {
        console.error('Error procesando operación para disparos equipo:', op.id, error);
      }
    });

    // Convertir el mapa a un array
    return Array.from(mapaDisparos.values());
}

  // =========================================
  // 🔥 CALCULO METROS
  // =========================================
  calcularMetrosPerforados(registrosArray: any[]): number {
    console.log('=== INICIO calcularMetrosPerforados ===');
    
    if (!Array.isArray(registrosArray)) {
      console.error('No es un array, es:', typeof registrosArray, registrosArray);
      return 0;
    }
    
    let totalMetros = 0;
    let registrosProcesados = 0;
    
    for (const registro of registrosArray) {
      if (registro.estado !== 'OPERATIVO') {
        continue;
      }
      
      registrosProcesados++;
      console.log(`Procesando registro #${registro.numero} (${registro.codigo}) - Estado: ${registro.estado}`);
      
      try {
        const op = registro.operacion || registro;
        
        const talProd = Number(op.tal_prod) || 0;
        const talRimados = Number(op.tal_rimados) || 0;
        const talAlivio = Number(op.tal_alivio) || 0;
        const talRepaso = Number(op.tal_repaso) || 0;
        const longBarras = Number(op.long_barras) || 0;
        
        const totalTaladros = talProd + talRimados + talAlivio + talRepaso;
        const metrosRegistro = totalTaladros * longBarras * 0.3048;
        
        if (totalTaladros > 0) {
          console.log(`  ✓ ${totalTaladros} taladros × ${longBarras} pies × 0.3048 = ${metrosRegistro.toFixed(2)} metros`);
          totalMetros += metrosRegistro;
        } else {
          console.log(`  ✗ Sin taladros para perforar`);
        }
        
      } catch (error) {
        console.error(`Error en registro ${registro.numero}:`, error);
      }
    }
    
    console.log(`📊 RESULTADO: ${registrosProcesados} registros OPERATIVOS → ${totalMetros.toFixed(2)} metros`);
    console.log('=== FIN cálculo ===\n');
    
    return totalMetros;
  }

  // =========================================
  // 🔥 FILTRAR AREAS DEL PLAN
  // =========================================
  obtenerAreasValidas(): string[] {
    return this.planesMensuales
      .filter(p => p.area)
      .map(p => p.area as string);
  }

  // =========================================
  // 🔥 DATA PARA GRAFICO AVANCE FASE
  // =========================================
  procesarAvanceFase() {
    const areasValidas = this.obtenerAreasValidas();

    return this.operacionesFiltradas.map(op => {
      let area = '';
      let metros = 0;

      try {
        const registrosArray = op.registros;
        
        if (Array.isArray(registrosArray) && registrosArray.length > 0) {
          const primerRegistro = registrosArray[0];
          area = primerRegistro?.operacion?.area || primerRegistro?.area || '';
          metros = this.calcularMetrosPerforados(registrosArray);
        }
        
      } catch (error) {
        console.error('Error procesando registros:', error);
      }

      return {
        area,
        metros
      };
    })
    .filter(item => areasValidas.includes(item.area));
  }

  // =========================================
  // SEGUNDO GRAFICO - RESUMEN
  // =========================================
  procesarResumen() {
    let totalMetros = 0;
    let nFrentes = 0;
    const equiposSet = new Set<string>();

    this.operacionesFiltradas.forEach(op => {
      if (op.modelo_equipo) {
        equiposSet.add(op.modelo_equipo);
      }

      try {
        const registrosArray = op.registros;
        
        if (Array.isArray(registrosArray)) {
          const metros = this.calcularMetrosPerforados(registrosArray);
          totalMetros += metros;
          
          for (const registro of registrosArray) {
            if (registro.estado === 'OPERATIVO') {
              const operacion = registro.operacion || registro;
              if (operacion.tipo_perforacion === 'FRENTE COMPLETO') {
                nFrentes++;
                break;
              }
            }
          }
        }
        
      } catch (error) {
        console.error('Error procesando operación:', op.id, error);
      }
    });

    const metrosPorDisparo = nFrentes > 0 ? totalMetros / nFrentes : 0;

    this.resumen = {
      conteoEquipos: equiposSet.size,
      metrosPorDisparo: Number(metrosPorDisparo.toFixed(2)),
      nFrentes,
      totalMetros: Number(totalMetros.toFixed(2))
    };
    
    console.log('📊 RESUMEN FINAL:', this.resumen);
  }
}