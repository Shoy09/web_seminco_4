// formulario-perforacion.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DatosPerforacion {
  ubicacion: { nivel: string; tipoLabor: string; labor: string; ala: string; };
  taladros: { produccion: string; rimados: string; alivio: string; repaso: string; };
  barras: { longitud: string; nBarra: string; };
  pernos: { tipo: string; log: string; nInstalados: string; };
  malla: { tipo: string; mts2: string; sistematicoPuntual: string; };
  tipoPerforacion: string;
  observaciones: string;
}

@Component({
  selector: 'app-formulario-perforacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-perforacion.component.html',
  styleUrl: './formulario-perforacion.component.css'
})
export class FormularioPerforacionComponent implements OnInit, OnChanges {

  @Input() visible = false;
  @Input() operacion: any;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>(); // 🔥 Emitir datos guardados

  public formularioInvalido = false;
  public datosPerforacion: DatosPerforacion = this.getInitDatosPerforacion();

  public niveles: string[] = ['100', '200'];
  public tiposLabor: string[] = ['RAMPA', 'GALERIA'];
  public labores: string[] = ['RAMPA 1', 'GALERIA A'];
  public alas: string[] = ['NORTE', 'SUR'];
  public tiposPerforacion: string[] = ['PRODUCCIÓN', 'DESARROLLO', 'SOSTENIMIENTO'];

  constructor() {}
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['operacion'] && this.operacion) {
      this.cargarDatosOperacion(this.operacion);
    }
  }

  cargarDatosOperacion(op: any) {
    console.log('📥 Datos recibidos en operacion:', op);

    this.datosPerforacion.ubicacion.nivel = op.nivel || '';
    this.datosPerforacion.ubicacion.tipoLabor = op.tipo_labor || '';
    this.datosPerforacion.ubicacion.labor = op.labor || '';
    this.datosPerforacion.ubicacion.ala = op.ala || '';

    this.datosPerforacion.taladros.produccion = op.tal_prod || '';
    this.datosPerforacion.taladros.rimados = op.tal_rimados || '';
    this.datosPerforacion.taladros.alivio = op.tal_alivio || '';
    this.datosPerforacion.taladros.repaso = op.tal_repaso || '';

    this.datosPerforacion.barras.longitud = op.long_barras || '';
    this.datosPerforacion.barras.nBarra = op.num_barras || '';

    this.datosPerforacion.pernos.tipo = op.tipo_pernos || '';
    this.datosPerforacion.pernos.log = op.log_pernos || '';
    this.datosPerforacion.pernos.nInstalados = op.n_pernos_instalados || '';

    this.datosPerforacion.malla.tipo = op.tipo_malla || '';
    this.datosPerforacion.malla.mts2 = op.mt52_malla || '';
    this.datosPerforacion.malla.sistematicoPuntual = op.sistematico_puntual || '';

    this.datosPerforacion.tipoPerforacion = op.tipo_perforacion || '';
    this.datosPerforacion.observaciones = op.observaciones || '';

    // Agregar a listas dinámicas
    this.agregarSiNoExiste(this.niveles, op.nivel);
    this.agregarSiNoExiste(this.tiposLabor, op.tipo_labor);
    this.agregarSiNoExiste(this.labores, op.labor);
    this.agregarSiNoExiste(this.alas, op.ala);
    this.agregarSiNoExiste(this.tiposPerforacion, op.tipo_perforacion);
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

  guardarPerforacion() {
    if (this.validarFormulario()) {
      // 🔥 Emitir los datos al padre
      this.guardar.emit(this.datosPerforacion);
      this.formularioInvalido = false;
    } else {
      this.formularioInvalido = true;
      console.warn('⚠️ Formulario inválido: faltan campos obligatorios');
    }
  }

  validarFormulario(): boolean {
    const u = this.datosPerforacion.ubicacion;
    return !!(u.nivel && u.tipoLabor && u.labor);
  }

  private getInitDatosPerforacion(): DatosPerforacion {
    return {
      ubicacion: { nivel: '', tipoLabor: '', labor: '', ala: '' },
      taladros: { produccion: '', rimados: '', alivio: '', repaso: '' },
      barras: { longitud: '', nBarra: '' },
      pernos: { tipo: '', log: '', nInstalados: '' },
      malla: { tipo: '', mts2: '', sistematicoPuntual: '' },
      tipoPerforacion: '',
      observaciones: ''
    };
  }
}