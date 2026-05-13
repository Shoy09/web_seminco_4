import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import * as XLSX from 'xlsx-js-style';
import { ToastrService } from 'ngx-toastr';
import { ExplosivoService } from '../../../../services/explosivo.service';
import { AccesorioService } from '../../../../services/accesorio.service';
import { Accesorio } from '../../../../models/Accesorio';
import { Explosivo } from '../../../../models/Explosivo';
import { NubeDatosTrabajoExploracionesService } from '../../../../services/nube-datos-trabajo-exploraciones.service';
import { NubeDatosTrabajoExploraciones } from '../../../../models/nube-datos-trabajo-exploraciones';
import { ExportExcelService } from '../export-excel.service';

@Component({
  selector: 'app-explosivos-graficos',
  imports: [NgApexchartsModule, CommonModule, FormsModule],
  templateUrl: './explosivos-graficos.component.html',
  styleUrl: './explosivos-graficos.component.css'
})
export class ExplosivosGraficosComponent implements OnInit {
    datosExplosivos: NubeDatosTrabajoExploraciones[] = [];
  datosExplosivosOriginal: NubeDatosTrabajoExploraciones[] = [];
    datosExplosivosExport: NubeDatosTrabajoExploraciones[] = [];
    accesorios: Accesorio[] = [];
    explosivos: Explosivo[] = [];
  fechaDesde: string = '';
fechaHasta: string = '';
turnoSeleccionado: string = '';
turnos: string[] = ['DÍA', 'NOCHE'];
  constructor(private exportExcelService: ExportExcelService,private explosivosService: NubeDatosTrabajoExploracionesService, private _toastr: ToastrService, private explosivoService: ExplosivoService,
      private accesorioService: AccesorioService,) {}

  ngOnInit(): void {
    const fechaISO = this.obtenerFechaLocalISO();
    this.fechaDesde = fechaISO;
    this.fechaHasta = fechaISO;
    this.turnoSeleccionado = this.obtenerTurnoActual();
  
  this.cargarExplosivos();
  this.cargarAccesorios();

    this.obtenerDatos();
  }

  obtenerFechaLocalISO(): string {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // meses comienzan en 0
    const dia = hoy.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  obtenerTurnoActual(): string {
    const ahora = new Date();
    const hora = ahora.getHours();
  
    // Turno de día: 7:00 AM a 6:59 PM (07:00 - 18:59)
    if (hora >= 7 && hora < 19) {
      return 'DÍA';
    } else {
      // Turno de noche: 7:00 PM a 6:59 AM
      return 'NOCHE';
    }
  } 

  cargarExplosivos(): void {
  this.explosivoService.getExplosivos().subscribe(
    (data) => {
      this.explosivos = data;
      console.log('Explosivos cargados:', this.explosivos);
    },
    (error) => {
      console.error('Error al cargar explosivos', error);
    }
  );
}

cargarAccesorios(): void {
  this.accesorioService.getAccesorios().subscribe(
    (data) => {
      this.accesorios = data;
      console.log('Accesorios cargados:', this.accesorios);
    },
    (error) => {
      console.error('Error al cargar accesorios', error);
    }
  );
}

  obtenerDatos(): void {
  this.explosivosService.getExplosivos().subscribe({
    next: (data) => {
      this.datosExplosivosOriginal = data;
      this.datosExplosivosExport = data;

      // Aplicar filtros por fecha actual y turno automáticamente
      const filtros = {
        fechaDesde: this.fechaDesde,
        fechaHasta: this.fechaHasta,
        turnoSeleccionado: this.turnoSeleccionado
      };

      // Mostrar notificación de éxito
      this._toastr.success('Datos cargados correctamente', '✔ Éxito');
      console.log('Datos obtenidos:', this.datosExplosivosOriginal);
    },
    error: (err) => {
      console.error('❌ Error al obtener datos:', err);
      this._toastr.error('Error al cargar los datos, token invalido', '❌ Error');
    }
  });
}

    quitarFiltros(): void {
    const fechaISO = this.obtenerFechaLocalISO();
    this.fechaDesde = fechaISO;
    this.fechaHasta = fechaISO;
    this.turnoSeleccionado = this.obtenerTurnoActual();
  
    const filtros = {
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
      turnoSeleccionado: this.turnoSeleccionado
    };
  
    this.datosExplosivos = this.filtrarDatos(this.datosExplosivosOriginal, filtros);
    
    // Filtrar metas según el mes actual
    // this.filtrarMetasPorMes(this.fechaDesde, this.fechaHasta);
    
  }

  aplicarFiltrosLocales(): void {
  // Crear objeto con los filtros actuales
  const filtros = {
    fechaDesde: this.fechaDesde,
    fechaHasta: this.fechaHasta,
    turnoSeleccionado: this.turnoSeleccionado
  };

  // Aplicar filtros a los datos ORIGINALES (this.datosExplosivosOriginal)
  const datosFiltrados = this.filtrarDatos(this.datosExplosivosOriginal, filtros);
  
  // Actualizar los datos filtrados
  this.datosExplosivos = datosFiltrados;

  // Reprocesar los gráficos con los datos filtrados (si tienes esta función)
}

  
  filtrarDatos(datos: NubeDatosTrabajoExploraciones[], filtros: any): NubeDatosTrabajoExploraciones[] {
    return datos.filter(operacion => {
      const fechaOperacion = new Date(operacion.fecha);
      const fechaDesde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : null;
      const fechaHasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : null;
  
      // Verificar si la fecha de operación está dentro del rango
      if (fechaDesde && fechaOperacion < fechaDesde) {
        return false;
      }
  
      if (fechaHasta && fechaOperacion > fechaHasta) {
        return false;
      }
  
      // Verificar si el turno de la operación coincide con el turno seleccionado
      if (filtros.turnoSeleccionado && operacion.turno !== filtros.turnoSeleccionado) {
        return false;
      }
  
      return true;
    });
  }

exportarAExcelExplosivosfiltro(): void {
  this.exportExcelService.exportarExplosivosAExcel(
    this.datosExplosivos,  // Datos filtrados
    this.explosivos,       // Lista de explosivos
    this.accesorios,       // Lista de accesorios
    'BD_Explosivos_Filtrados.xlsx'  // Nombre opcional
  );
}

exportarAExcelExplosivos(): void {
  this.exportExcelService.exportarExplosivosAExcel(
    this.datosExplosivosExport,  // Datos originales
    this.explosivos,
    this.accesorios,
    'BD_Explosivos_Completa.xlsx'
  );
}

}
