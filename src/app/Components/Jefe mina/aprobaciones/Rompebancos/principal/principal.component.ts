import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardOperacionesComponent } from '../card-operaciones/card-operaciones.component';
import { BotonsComponent } from "../botons/botons.component";
import { TablaComponent } from "../tabla/tabla.component";
import { MenuAccionesComponent } from "../menuAcciones/menuAcciones.component";
import { OperacionesService } from '../../../../../services/operaciones.service';
import { OperacionBase } from '../../../../../models/OperacionBase.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CardOperacionesComponent,
    TablaComponent,
    MenuAccionesComponent,
    CommonModule,
],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalRompebancosComponent implements OnInit {

  tipo: string = 'rompebanco';
  operacion!: OperacionBase;
  loading = false;

  // 🔥 DATA MAPEADA PARA CADA COMPONENTE
  cardData: any;
  tablaData: any[] = [];
  horometrosData: any;
condicionesData: any;
checkListData: any[] = [];
llantasData: any;

  constructor(
    private route: ActivatedRoute,
    private operacionesService: OperacionesService
  ) {}

  ngOnInit(): void {
    this.obtenerOperacion();
  }

  obtenerOperacion() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error('No se recibió ID');
      return;
    }

    this.loading = true;

    this.operacionesService.getById(this.tipo, +id)
      .subscribe({
        next: (resp) => {
          this.operacion = resp.data;
          console.log("operacion",this.operacion);

          // 🔥 AQUÍ HACES TODOS LOS MAPEOS
          this.mapearDatos();

          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  // 🔥 CENTRALIZAS TODOS LOS MAPEOS
  mapearDatos() {
  this.cardData = this.mapearParaCard(this.operacion);
  this.tablaData = this.mapearParaTabla(this.operacion);

  // 🔥 NUEVOS
   this.horometrosData = this.mapearParaHorometros(this.operacion);
   this.condicionesData = this.mapearParaCondiciones(this.operacion);
   this.checkListData = this.mapearParaCheckList(this.operacion);
   this.llantasData = this.mapearParaLlantas(this.operacion);
}

  // 🔥 MAPEO SOLO PARA CARD
  mapearParaCard(op: OperacionBase) {
    return {
      fecha: op.fecha,
      turno: op.turno,
      operador: op.operador,
      jefeGuardia: op.jefe_guardia,
      equipo: op.equipo,
      codigo: op.n_equipo,
      seccion: op.seccion || '',
      tipo_equipo: op.tipo_equipo || '',
      modelo_equipo: op.modelo_equipo || '' 
    };
  }

    mapearParaTabla(op: OperacionBase) {

  if (!op.registros) return [];

  let registros = op.registros;

  // 🔥 si aún viniera como string (por seguridad)
  if (typeof registros === 'string') {
    try {
      registros = JSON.parse(registros);
    } catch {
      return [];
    }
  }

  // 🔥 aseguramos que sea array
  if (!Array.isArray(registros)) return [];

  // 🔥 aquí puedes transformar cada fila si quieres
  return registros.map((item: any) => ({
    ...item
  }));
}

  parseSeguro(valor: any) {
  if (!valor) return null;

  if (typeof valor === 'string') {
    try {
      return JSON.parse(valor);
    } catch {
      return null;
    }
  }

  return valor;
}

mapearParaHorometros(op: OperacionBase) {
  const h = this.parseSeguro(op.horometros);

  if (!h || typeof h !== 'object') return null;

  return {
    diesel: h.diesel || null,
  };
}

mapearParaCondiciones(op: OperacionBase) {
  const c = this.parseSeguro(op.condiciones_equipo);

  if (!c || typeof c !== 'object') return null;

  return {
    aceiteMotor: !!c.aceiteMotor,
    aceiteHidraulico: !!c.aceiteHidraulico,
    aceiteTransmision: !!c.aceiteTransmision,
    combustible: c.combustible || '',
    descripcion: c.descripcion || '',
    horaLlenado: c.horaLlenado || '',
    lugar: c.lugar || '',
    operativo: !!c.op,
    noOperativo: !!c.noOp
  };
}

mapearParaCheckList(op: OperacionBase) {
  let lista = this.parseSeguro(op.check_list);

  if (!Array.isArray(lista)) return [];

  return lista.map((item: any) => ({
    ...item
  }));
}

mapearParaLlantas(op: OperacionBase) {
  const l = this.parseSeguro(op.control_llantas);

  if (!l || typeof l !== 'object') return null;

  return {
    numero1: !!l.numero1,
    numero2: !!l.numero2,
    numero3: !!l.numero3,
    numero4: !!l.numero4
  };
}

}