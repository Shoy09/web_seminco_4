import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Estado } from '../../../models/Estado';
import { EstadoService } from '../../../services/estado.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ProcesosService } from '../../../services/procesos.service';
import { Proceso } from '../../../models/Proceso';
import { CategoriaEstado } from '../../../models/CategoriaEstado';
@Component({
  selector: 'app-estado-form-editar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './estado-form-editar.component.html',
  styleUrl: './estado-form-editar.component.css',
})
export class EstadoFormEditarComponent implements OnInit {
  estadoForm!: FormGroup;
  categorias: CategoriaEstado[] = [];
  procesos: Proceso[] = [];

  get esEdicion(): boolean {
    return !!this.data?.id;
  }

  constructor(
    private fb: FormBuilder,
    private estadoService: EstadoService,
    private procesosService: ProcesosService,
    public dialogRef: MatDialogRef<EstadoFormEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Estado | null,
  ) {}

  ngOnInit(): void {
    this.estadoForm = this.fb.group({
      codigo: [this.data?.codigo || '', Validators.required],
      tipo_estado: [this.data?.tipo_estado || '', Validators.required],
      categoria_id: [this.data?.categoria_id || null, Validators.required],
      proceso_id: [this.data?.proceso_id || null, Validators.required],
    });

    this.getCategoriasEstados();
    this.getProcesos();
  }

  getCategoriasEstados(): void {
    this.estadoService.getCategoriasEstados().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al obtener las categorias de estados:', error);
      },
    });
  }

  getProcesos(): void {
    this.procesosService.getProcesos().subscribe({
      next: (data) => {
        this.procesos = data;
      },
      error: (error) => {
        console.error('Error al obtener los procesos:', error);
      },
    });
  }

  guardarCambios(): void {
    if (this.estadoForm.invalid) {
      this.estadoForm.markAllAsTouched();
      return;
    }

    const categoriaSeleccionada = this.categorias.find(
      (categoria) => categoria.id === this.estadoForm.value.categoria_id,
    );
    const procesoSeleccionado = this.procesos.find(
      (proceso) => proceso.id === this.estadoForm.value.proceso_id,
    );

    const payload = {
      ...this.data,
      ...this.estadoForm.value,
      categoria: categoriaSeleccionada?.nombre || this.data?.categoria || '',
      proceso: procesoSeleccionado?.nombre || this.data?.proceso || '',
    } as Estado;

    const request$ = this.esEdicion && this.data
      ? this.estadoService.updateEstado(this.data.id, payload)
      : this.estadoService.createEstado(payload);

    request$.subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error(
          this.esEdicion
            ? 'Error al actualizar el estado:'
            : 'Error al crear el estado:',
          error,
        );
      },
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
