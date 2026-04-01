import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DatosPerforacion {
  ubicacion: { nivel: string; tipoLabor: string; labor: string; ala: string; };
  taladros: { produccion: string; rimados: string; alivio: string; repaso: string; };
  barras: { longitud: string; nBarra: string; };
  pernos: { tipo: string; log: string; nInstalados: string; };
  malla: { tipo: string; mts2: string; sistematicoPuntual: string; };
  tipoPerforacion: string;  // 🔥 NUEVO CAMPO
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

  public formularioInvalido = false;
  public datosPerforacion: DatosPerforacion = this.getInitDatosPerforacion();

  // 🔥 LISTAS DINÁMICAS
  public niveles: string[] = ['100', '200'];
  public tiposLabor: string[] = ['RAMPA', 'GALERIA'];
  public labores: string[] = ['RAMPA 1', 'GALERIA A'];
  public alas: string[] = ['NORTE', 'SUR'];
  public tiposPerforacion: string[] = ['PRODUCCIÓN', 'DESARROLLO', 'SOSTENIMIENTO']; // 🔥 NUEVA LISTA

  constructor() {}
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['operacion'] && this.operacion) {
      const op = this.operacion;

      console.log('📥 Datos recibidos en operacion:', op);

      // 🔥 UBICACIÓN
      this.datosPerforacion.ubicacion.nivel = op.nivel || '';
      this.datosPerforacion.ubicacion.tipoLabor = op.tipo_labor || '';
      this.datosPerforacion.ubicacion.labor = op.labor || '';
      this.datosPerforacion.ubicacion.ala = op.ala || '';

      // 🔥 TALADROS
      this.datosPerforacion.taladros.produccion = op.tal_prod || '';
      this.datosPerforacion.taladros.rimados = op.tal_rimados || '';
      this.datosPerforacion.taladros.alivio = op.tal_alivio || '';
      this.datosPerforacion.taladros.repaso = op.tal_repaso || '';

      // 🔥 BARRAS
      this.datosPerforacion.barras.longitud = op.long_barras || '';
      this.datosPerforacion.barras.nBarra = op.num_barras || '';

      // 🔥 PERNOS
      this.datosPerforacion.pernos.tipo = op.tipo_pernos || '';
      this.datosPerforacion.pernos.log = op.log_pernos || '';
      this.datosPerforacion.pernos.nInstalados = op.n_pernos_instalados || '';

      // 🔥 MALLA
      this.datosPerforacion.malla.tipo = op.tipo_malla || '';
      this.datosPerforacion.malla.mts2 = op.mt52_malla || '';
      this.datosPerforacion.malla.sistematicoPuntual = op.sistematico_puntual || '';

      // 🔥 TIPO PERFORACIÓN (NUEVO)
      this.datosPerforacion.tipoPerforacion = op.tipo_perforacion || '';

      // 🔥 OBSERVACIONES
      this.datosPerforacion.observaciones = op.observaciones || '';

      // 🔥 LISTAS DINÁMICAS
      this.agregarSiNoExiste(this.niveles, op.nivel);
      this.agregarSiNoExiste(this.tiposLabor, op.tipo_labor);
      this.agregarSiNoExiste(this.labores, op.labor);
      this.agregarSiNoExiste(this.alas, op.ala);
      this.agregarSiNoExiste(this.tiposPerforacion, op.tipo_perforacion); // 🔥 NUEVO
      
      // También agregar valores dinámicos para taladros y barras si es necesario
      this.agregarSiNoExisteATaladros(op.tal_prod, op.tal_rimados, op.tal_alivio, op.tal_repaso);
      this.agregarSiNoExisteABarras(op.long_barras, op.num_barras);
    }
  }

  // 🔥 FUNCIÓN REUTILIZABLE PARA LISTAS
  agregarSiNoExiste(lista: string[], valor: string) {
    if (!valor) return;

    const limpio = valor.trim();

    if (limpio && !lista.includes(limpio)) {
      lista.push(limpio);
      console.log(`✅ Agregado a lista: ${limpio}`);
    }
  }

  // 🔥 FUNCIÓN PARA AGREGAR VALORES DE TALADROS A LISTAS DINÁMICAS
  agregarSiNoExisteATaladros(produccion: string, rimados: string, alivio: string, repaso: string) {
    console.log('📊 Datos de taladros:', { produccion, rimados, alivio, repaso });
  }

  // 🔥 FUNCIÓN PARA AGREGAR VALORES DE BARRAS A LISTAS DINÁMICAS
  agregarSiNoExisteABarras(longitud: string, numBarra: string) {
    console.log('📏 Datos de barras:', { longitud, numBarra });
  }

  cerrarFormPerforacion() {
    this.cerrar.emit();
  }

  guardarPerforacion() {
    if (this.validarFormulario()) {
      console.log('💾 Datos guardados:', this.datosPerforacion);
      
      // Aquí puedes emitir los datos al componente padre si es necesario
      // this.guardar.emit(this.datosPerforacion);
      
      this.cerrar.emit();
      this.formularioInvalido = false;
    } else {
      this.formularioInvalido = true;
      console.warn('⚠️ Formulario inválido: faltan campos obligatorios');
    }
  }

  validarFormulario(): boolean {
    const u = this.datosPerforacion.ubicacion;
    // Validar campos obligatorios de ubicación
    return !!(u.nivel && u.tipoLabor && u.labor);
  }

  private getInitDatosPerforacion(): DatosPerforacion {
    return {
      ubicacion: { nivel: '', tipoLabor: '', labor: '', ala: '' },
      taladros: { produccion: '', rimados: '', alivio: '', repaso: '' },
      barras: { longitud: '', nBarra: '' },
      pernos: { tipo: '', log: '', nInstalados: '' },
      malla: { tipo: '', mts2: '', sistematicoPuntual: '' },
      tipoPerforacion: '',  // 🔥 NUEVO CAMPO
      observaciones: ''
    };
  }
}