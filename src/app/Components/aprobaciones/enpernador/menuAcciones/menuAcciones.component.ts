import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AccionItem {
  id: string;
  texto: string;
  icono: string;
}

@Component({
  selector: 'app-menuAcciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menuAcciones.component.html',
  styleUrls: ['./menuAcciones.component.css']
})
export class MenuAccionesComponent implements OnInit {

  public acciones: AccionItem[] = [
    { id: 'horometro', texto: 'Horómetro', icono: 'fa-gauge' },
    { id: 'condiciones', texto: 'Condiciones de equipo', icono: 'fa-screwdriver-wrench' },
    { id: 'checklist', texto: 'CheckList', icono: 'fa-list-check' },
    { id: 'presion', texto: 'Presión de llantas', icono: 'fa-truck-field' },
    { id: 'actualizar', texto: 'Actualizar registro', icono: 'fa-arrows-rotate' }
  ];

  public accionSeleccionada: string = '';

  // IMAGEN DE PRESIONDELLANTAS (INSPECCIÓNVISUAL)
  public imagenEquipoUrl: string = 'inspec-visual/image-prueba.jpeg';
  
  // Estados de visibilidad de Modales
  public mostrarModalHorometro: boolean = false;
  public mostrarModalCondiciones: boolean = false;
  public mostrarModalChecklist: boolean = false;
  public itemsChecklist: any[] = []; 
  public mostrarModalInspeccion: boolean = false;

  // Datos: Horómetros
  public filasHorometro = [
    { nombre: 'Diesel', inicial: 0, final: 0, op: true, inop: false },
    { nombre: 'Eléctrico', inicial: 0, final: 0, op: true, inop: false },
    { nombre: 'Percusión', inicial: 0, final: 0, op: true, inop: false },
    { nombre: 'Empernador', inicial: 0, final: 0, op: true, inop: false }
  ];

  // Datos: Condiciones
  public condicionesEquipo = [
    { item: 'Motor', estado: 'Operativo', observacion: '' },
    { item: 'Sistema Hidráulico', estado: 'Operativo', observacion: '' },
    { item: 'Luces y Alarma', estado: 'Operativo', observacion: '' },
    { item: 'Frenos', estado: 'Operativo', observacion: '' }
  ];

  public opcionesEstado = ['Operativo', 'Regular', 'Inoperativo', 'N/A'];

  constructor() { }
  ngOnInit() { }

seleccionarAccion(id: string) {
  this.accionSeleccionada = id;
  
  switch(id) {
    case 'horometro':
      this.mostrarModalHorometro = true;
      break;
    case 'condiciones':
      this.mostrarModalCondiciones = true;
      break;
    case 'checklist':
      this.mostrarModalChecklist = true;
      break;
      case 'presion': 
      this.mostrarModalInspeccion = true;
      break;
  }
}

cerrarModales() {
  this.mostrarModalHorometro = false;
  this.mostrarModalCondiciones = false;
  this.mostrarModalChecklist = false; // <--- Cerrar checklist
  this.accionSeleccionada = '';
  this.mostrarModalInspeccion = false;
}

guardarChecklist() {
  console.log('Guardando Checklist...', this.itemsChecklist);
  this.cerrarModales();
  
}

  // Lógica de guardado
  guardarHorometros() {
    console.log('Horómetros:', this.filasHorometro);
    this.cerrarModales();
  }

  guardarCondiciones() {
    console.log('Condiciones:', this.condicionesEquipo);
    this.cerrarModales();
  }

  guardarInspeccion() {
    console.log('Inspección visual guardada');
    this.cerrarModales();
  }

  toggleStatus(fila: any, tipo: string) {
    fila.op = (tipo === 'op');
    fila.inop = (tipo === 'inop');
  }
}