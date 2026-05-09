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

// ✅ NUEVA INTERFAZ SIMPLE
interface DatosPerforacion {
  nivel: string;
  tipoLabor: string;
  labor: string;
  ala: string;
  observaciones: string;
}

@Component({
  selector: 'app-formulario-perforacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-perforacion.component.html',
  styleUrl: './formulario-perforacion.component.css',
})
export class FormularioPerforacionComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() operacion: any;
  @Input() estado: string = '';
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  public formularioInvalido = false;

  // ✅ NUEVA ESTRUCTURA
  public datosPerforacion: DatosPerforacion =
    this.getInitDatosPerforacion();

  // Datos para selects
  public niveles: string[] = ['100', '200', '300', '400'];
  public tiposLabor: string[] = ['RAMPA', 'GALERIA', 'CHIMENEA', 'SUB-NIVEL'];
  public labores: string[] = [];
  public alas: string[] = ['NORTE', 'SUR', 'ESTE', 'OESTE'];

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

    this.datosPerforacion.nivel = op.nivel || '';
    this.datosPerforacion.tipoLabor = op.tipo_labor || '';
    this.datosPerforacion.labor = op.labor || '';
    this.datosPerforacion.ala = op.ala || '';
    this.datosPerforacion.observaciones = op.observaciones || '';

    // Agregar dinámicamente
    this.agregarSiNoExiste(this.niveles, op.nivel);
    this.agregarSiNoExiste(this.tiposLabor, op.tipo_labor);
    this.agregarSiNoExiste(this.labores, op.labor);
    this.agregarSiNoExiste(this.alas, op.ala);
  }

  agregarSiNoExiste(lista: string[], valor: string) {
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
        '⚠️ Formulario inválido: faltan campos obligatorios',
      );
    }
  }

  validarFormulario(): boolean {
    return true;
  }

  private getInitDatosPerforacion(): DatosPerforacion {
    return {
      nivel: '',
      tipoLabor: '',
      labor: '',
      ala: '',
      observaciones: '',
    };
  }
}