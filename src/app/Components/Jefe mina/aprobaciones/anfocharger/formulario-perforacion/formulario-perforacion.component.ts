import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

// ✅ NUEVA INTERFAZ REAL
interface DatosPerforacion {

  origen_nivel: string;
  origen_tipo_labor: string;
  origen_labor: string;
  origen_ala: string;

  observaciones: string;

  n_taladros_cargados?: number;
  n_cartuchos?: number;
  cantidad_anfo?: number;
}

@Component({
  selector: 'app-formulario-perforacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-perforacion.component.html',
  styleUrl: './formulario-perforacion.component.css',
})
export class FormularioPerforacionComponent
  implements OnInit, OnChanges {

  @Input() visible = false;
  @Input() operacion: any;
  @Input() estado: string = '';

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  public formularioInvalido = false;

  public datosPerforacion: DatosPerforacion =
    this.getInitDatosPerforacion();

  // Datos para selects
  public niveles: string[] = ['100', '200', '300', '400'];

  public tiposLabor: string[] = [
    'RAMPA',
    'GALERIA',
    'CHIMENEA',
    'SUB-NIVEL'
  ];

  public labores: string[] = [];

  public alas: string[] = [
    'NORTE',
    'SUR',
    'ESTE',
    'OESTE'
  ];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['operacion'] && this.operacion) {
      this.cargarDatosOperacion(this.operacion);
    }
  }

  public get mostrarCamposCompletos(): boolean {
    return this.estado === 'OPERATIVO';
  }

  // ✅ CARGAR DATOS
  cargarDatosOperacion(op: any) {

    console.log('📥 Cargando operación:', op);

    this.datosPerforacion.origen_nivel =
      op.origen_nivel || '';

    this.datosPerforacion.origen_tipo_labor =
      op.origen_tipo_labor || '';

    this.datosPerforacion.origen_labor =
      op.origen_labor || '';

    this.datosPerforacion.origen_ala =
      op.origen_ala || '';

    this.datosPerforacion.observaciones =
      op.observaciones || '';

    this.datosPerforacion.n_taladros_cargados =
      op.n_taladros_cargados || 0;

    this.datosPerforacion.n_cartuchos =
      op.n_cartuchos || 0;

    this.datosPerforacion.cantidad_anfo =
      op.cantidad_anfo || 0;

    // Agregar dinámicamente
    this.agregarSiNoExiste(
      this.niveles,
      op.origen_nivel
    );

    this.agregarSiNoExiste(
      this.tiposLabor,
      op.origen_tipo_labor
    );

    this.agregarSiNoExiste(
      this.labores,
      op.origen_labor
    );

    this.agregarSiNoExiste(
      this.alas,
      op.origen_ala
    );
  }

  agregarSiNoExiste(
    lista: string[],
    valor: string
  ) {

    if (!valor) return;

    const limpio = valor.trim();

    if (limpio && !lista.includes(limpio)) {
      lista.push(limpio);
    }
  }

  cerrarFormPerforacion() {
    this.cerrar.emit();
  }

  // ✅ GUARDAR
  guardarPerforacion() {

    if (this.validarFormulario()) {

      console.log(
        '📤 Emitiendo datos perforación:',
        this.datosPerforacion,
      );

      this.guardar.emit(this.datosPerforacion);

      this.formularioInvalido = false;

    } else {

      this.formularioInvalido = true;

      console.warn(
        '⚠️ Formulario inválido'
      );
    }
  }

  validarFormulario(): boolean {
    return true;
  }

  private getInitDatosPerforacion(): DatosPerforacion {

    return {

      origen_nivel: '',
      origen_tipo_labor: '',
      origen_labor: '',
      origen_ala: '',

      observaciones: '',

      n_taladros_cargados: 0,
      n_cartuchos: 0,
      cantidad_anfo: 0
    };
  }
}