import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DatosOperacion {
  origen: { nivel: string; tipoLabor: string; labor: string; ala: string; };
  destino: { nivel: string; tipoLabor: string; labor: string; ala: string; };
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
  public datosOperacion: DatosOperacion = this.getInitDatosOperacion();

  // 🔥 LISTAS DINÁMICAS
  public niveles: string[] = ['100', '200', '450'];
  public tiposLabor: string[] = ['RAMPA', 'GALERIA', 'SN'];
  public labores: string[] = ['RAMPA 1', 'GALERIA A', '382E'];
  public alas: string[] = ['NORTE', 'SUR', ''];

  constructor() {}
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['operacion'] && this.operacion) {
      const op = this.operacion;

      console.log('📥 Datos recibidos en operacion:', op);

      // 🔥 ORIGEN
      this.datosOperacion.origen.nivel = op.origen_nivel || '';
      this.datosOperacion.origen.tipoLabor = op.origen_tipo_labor || '';
      this.datosOperacion.origen.labor = op.origen_labor || '';
      this.datosOperacion.origen.ala = op.origen_ala || '';

      // 🔥 DESTINO
      this.datosOperacion.destino.nivel = op.destino_nivel || '';
      this.datosOperacion.destino.tipoLabor = op.destino_tipo_labor || '';
      this.datosOperacion.destino.labor = op.destino_labor || '';
      this.datosOperacion.destino.ala = op.destino_ala || '';

      // 🔥 OBSERVACIONES
      this.datosOperacion.observaciones = op.observaciones || '';

      // 🔥 LISTAS DINÁMICAS - ORIGEN
      this.agregarSiNoExiste(this.niveles, op.origen_nivel);
      this.agregarSiNoExiste(this.tiposLabor, op.origen_tipo_labor);
      this.agregarSiNoExiste(this.labores, op.origen_labor);
      this.agregarSiNoExiste(this.alas, op.origen_ala);

      // 🔥 LISTAS DINÁMICAS - DESTINO
      this.agregarSiNoExiste(this.niveles, op.destino_nivel);
      this.agregarSiNoExiste(this.tiposLabor, op.destino_tipo_labor);
      this.agregarSiNoExiste(this.labores, op.destino_labor);
      this.agregarSiNoExiste(this.alas, op.destino_ala);
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

  cerrarFormPerforacion() {
    this.cerrar.emit();
  }

  guardarPerforacion() {
    if (this.validarFormulario()) {
      console.log('💾 Datos guardados:', this.datosOperacion);
      
      // Aquí puedes emitir los datos al componente padre si es necesario
      // this.guardar.emit(this.datosOperacion);
      
      this.cerrar.emit();
      this.formularioInvalido = false;
    } else {
      this.formularioInvalido = true;
      console.warn('⚠️ Formulario inválido: faltan campos obligatorios');
    }
  }

  validarFormulario(): boolean {
    // Validar que al menos origen o destino tengan datos obligatorios
    const origen = this.datosOperacion.origen;
    const destino = this.datosOperacion.destino;
    
    // Al menos uno de los dos debe tener nivel y labor
    const origenValido = !!(origen.nivel && origen.labor);
    const destinoValido = !!(destino.nivel && destino.labor);
    
    return origenValido || destinoValido;
  }

  private getInitDatosOperacion(): DatosOperacion {
    return {
      origen: { nivel: '', tipoLabor: '', labor: '', ala: '' },
      destino: { nivel: '', tipoLabor: '', labor: '', ala: '' },
      observaciones: ''
    };
  }
}