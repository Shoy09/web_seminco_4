import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario-operacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-operacion.component.html',
  styleUrl: './formulario-operacion.component.css'
})
export class FormularioOperacionComponent implements OnInit, OnChanges {

  // 🔥 INPUTS DESDE EL PADRE
  @Input() visible = false;
  @Input() estadoSeleccionado = '';
  @Input() codigoSeleccionado = '';
  @Input() horaInicioSeleccionado = '';
  
  // 🔥 OUTPUTS
  @Output() cerrarForm = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<any>(); // 🔥 CAMBIADO: ahora emite datos

  // 🔥 DATOS DEL FORMULARIO
  public formData = {
    estado: '',
    codigo: '',
    horaInicio: ''
  };

  // 🔥 LISTA DINÁMICA
  public codigos: string[] = ['104', '105', '106'];
  public horas: string[] = ['07:30'];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    // 🔥 CARGAR DATOS CUANDO LLEGAN DEL PADRE
    if (changes['estadoSeleccionado'] && this.estadoSeleccionado) {
      this.formData.estado = this.estadoSeleccionado;
    }
    
    if (changes['codigoSeleccionado'] && this.codigoSeleccionado) {
      this.formData.codigo = this.codigoSeleccionado;
      this.agregarSiNoExiste(this.codigos, this.codigoSeleccionado);
    }
    
    if (changes['horaInicioSeleccionado'] && this.horaInicioSeleccionado) {
      this.formData.horaInicio = this.horaInicioSeleccionado;
      this.agregarSiNoExiste(this.horas, this.horaInicioSeleccionado);
    }
  }

  // 🔥 FUNCIÓN REUTILIZABLE
  agregarSiNoExiste(lista: string[], valor: string) {
    if (!valor) return;
    const limpio = valor.trim();
    if (limpio && !lista.includes(limpio)) {
      lista.push(limpio);
    }
  }

  cerrarFormOperacion() {
    this.cerrarForm.emit();
  }

  confirmarOperacion() {
    // 🔥 EMITIR LOS DATOS ACTUALIZADOS
    this.confirmar.emit({
      estado: this.formData.estado,
      codigo: this.formData.codigo,
      horaInicio: this.formData.horaInicio
    });
  }
}