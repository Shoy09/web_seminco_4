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

  @Input() visible = false;
  @Input() estadoSeleccionado = '';
  @Input() codigoSeleccionado = '';
  @Input() horaInicioSeleccionado = '';
  
  // 🔥 OUTPUTS MODIFICADOS
  @Output() cerrarForm = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<any>(); // 🔥 Emitir datos, no solo void

  public codigos: string[] = ['104', '105', '106'];
  public horas: string[] = ['07:30'];
  
  // 🔥 Datos del formulario
  public formData = {
    estado: '',
    codigo: '',
    horaInicio: ''
  };

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    // Cargar datos cuando llegan del padre
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
    // 🔥 Emitir los datos actualizados
    this.confirmar.emit({
      estado: this.formData.estado,
      codigo: this.formData.codigo,
      horaInicio: this.formData.horaInicio
    });
  }
}