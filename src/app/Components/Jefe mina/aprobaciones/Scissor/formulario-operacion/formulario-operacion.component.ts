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
  @Output() confirmar = new EventEmitter<void>();

  // 🔥 LISTA DINÁMICA
  public codigos: string[] = ['104', '105', '106'];
public horas: string[] = ['07:30'];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {

  //console.log('📥 Cambios detectados:', changes);

  if (changes['estadoSeleccionado']) {
    //console.log('🟢 Estado recibido:', this.estadoSeleccionado);
  }

  if (changes['codigoSeleccionado']) {
    //console.log('🔢 Código recibido:', this.codigoSeleccionado);
  }

  if (changes['horaInicioSeleccionado']) {
    //console.log('⏰ Hora inicio recibida:', this.horaInicioSeleccionado);
  }

  // 🔥 CÓDIGO DINÁMICO
  if (changes['codigoSeleccionado'] && this.codigoSeleccionado) {

    const codigo = this.codigoSeleccionado.trim();
    const existe = this.codigos.includes(codigo);

    if (!existe) {
      this.codigos.push(codigo);
      //console.log('✅ Código agregado:', codigo);
    }
  }

  // 🔥 HORA DINÁMICA (LO NUEVO)
  if (changes['horaInicioSeleccionado'] && this.horaInicioSeleccionado) {

    const hora = this.horaInicioSeleccionado.trim();
    const existe = this.horas.includes(hora);

    if (!existe) {
      this.horas.push(hora);
      //console.log('✅ Hora agregada:', hora);
    }
  }
}

  cerrarFormOperacion() {
    this.cerrarForm.emit();
  }

  confirmarOperacion() {
    this.confirmar.emit();
  }

}