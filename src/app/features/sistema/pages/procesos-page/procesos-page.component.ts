import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { Proceso } from '../../../../models/Proceso';
import { ConfirmService } from '../../../../services/confirm.service';
import { ProcesosService } from '../../../../services/procesos.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-procesos-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ProgressSpinnerModule,
    TableModule,
  ],
  templateUrl: './procesos-page.component.html',
  styleUrl: './procesos-page.component.css'
})
export class ProcesosPageComponent implements OnInit {
  private readonly procesosService = inject(ProcesosService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);

  procesos: Proceso[] = [];
  procesosFiltrados: Proceso[] = [];
  loading = false;
  saving = false;
  dialogVisible = false;
  editingProcesoId: number | null = null;
  busqueda = '';

  form: Omit<Proceso, 'id'> = {
    nombre: '',
    nombre_abreviado: '',
  };

  ngOnInit(): void {
    this.cargarProcesos();
  }

  cargarProcesos(): void {
    this.loading = true;
    this.procesosService
      .getProcesos()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (procesos) => {
          this.procesos = procesos;
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error('No se pudieron cargar los procesos', 'Revisa la conexion con el backend.');
        },
      });
  }

  abrirNuevoProceso(): void {
    this.editingProcesoId = null;
    this.form = {
      nombre: '',
      nombre_abreviado: '',
    };
    this.dialogVisible = true;
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    if (!texto) {
      this.procesosFiltrados = [...this.procesos];
      return;
    }

    this.procesosFiltrados = this.procesos.filter((proceso) =>
      [proceso.nombre, proceso.nombre_abreviado]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(texto))
    );
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.aplicarFiltros();
  }

  editarProceso(proceso: Proceso): void {
    this.editingProcesoId = proceso.id;
    this.form = {
      nombre: proceso.nombre,
      nombre_abreviado: proceso.nombre_abreviado,
    };
    this.dialogVisible = true;
  }

  guardarProceso(): void {
    const payload = {
      nombre: this.form.nombre.trim(),
      nombre_abreviado: this.form.nombre_abreviado.trim(),
    };

    if (!payload.nombre || !payload.nombre_abreviado) {
      this.toastService.warn('Campos requeridos', 'Completa nombre y nombre abreviado antes de guardar.');
      return;
    }

    this.saving = true;

    const request = this.editingProcesoId === null
      ? this.procesosService.createProceso(payload)
      : this.procesosService.updateProceso(this.editingProcesoId, payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(
          this.editingProcesoId === null ? 'Proceso creado' : 'Proceso actualizado'
        );
        this.dialogVisible = false;
        this.cargarProcesos();
      },
      error: () => {
        this.toastService.error(
          this.editingProcesoId === null ? 'No se pudo crear el proceso' : 'No se pudo actualizar el proceso'
        );
      },
    });
  }

  eliminarProceso(proceso: Proceso): void {
    this.confirmService.confirmDelete(
      `Se eliminara el proceso ${proceso.nombre}. Esta accion no se puede deshacer.`,
      () => {
        this.procesosService.deleteProceso(proceso.id).subscribe({
          next: () => {
            this.toastService.success('Proceso eliminado');
            this.procesos = this.procesos.filter((item) => item.id !== proceso.id);
            this.aplicarFiltros();
          },
          error: () => {
            this.toastService.error('No se pudo eliminar el proceso');
          },
        });
      }
    );
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.editingProcesoId = null;
  }

  get tituloDialog(): string {
    return this.editingProcesoId === null ? 'Nuevo proceso' : 'Editar proceso';
  }

}
