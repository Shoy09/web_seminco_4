import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TipoHorometro } from '../../../../models/TipoHorometro';
import { ConfirmService } from '../../../../services/confirm.service';
import { HorometroService } from '../../../../services/horometro.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-tipos-horometros-page',
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
  templateUrl: './tipos-horometros-page.component.html',
  styleUrl: './tipos-horometros-page.component.css',
})
export class TiposHorometrosPageComponent implements OnInit {
  private readonly horometroService = inject(HorometroService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);

  horometros: TipoHorometro[] = [];
  horometrosFiltrados: TipoHorometro[] = [];

  loading = false;
  saving = false;
  dialogVisible = false;
  editingId: number | null = null;

  busqueda = '';
  nombre = '';

  ngOnInit(): void {
    this.cargarHorometros();
  }

  cargarHorometros(): void {
    this.loading = true;
    this.horometroService
      .getHorometros()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.horometros = data;
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error('No se pudieron cargar los tipos de horometro');
        },
      });
  }

  abrirNuevo(): void {
    this.editingId = null;
    this.nombre = '';
    this.dialogVisible = true;
  }

  editar(item: TipoHorometro): void {
    this.editingId = item.id;
    this.nombre = item.nombre;
    this.dialogVisible = true;
  }

  guardar(): void {
    const nombre = this.nombre.trim();

    if (!nombre) {
      this.toastService.warn('Campo requerido', 'El nombre es obligatorio.');
      return;
    }

    this.saving = true;

    const request =
      this.editingId === null
        ? this.horometroService.createHorometro({ nombre })
        : this.horometroService.updateHorometro(this.editingId, { nombre });

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(
          this.editingId === null
            ? 'Tipo de horometro creado'
            : 'Tipo de horometro actualizado',
        );
        this.dialogVisible = false;
        this.cargarHorometros();
      },
      error: () => {
        this.toastService.error(
          this.editingId === null
            ? 'No se pudo crear el tipo de horometro'
            : 'No se pudo actualizar el tipo de horometro',
        );
      },
    });
  }

  eliminar(item: TipoHorometro): void {
    this.confirmService.confirmDelete(
      `Se eliminara el tipo de horometro "${item.nombre}". Esta accion no se puede deshacer.`,
      () => {
        this.horometroService.deleteHorometro(item.id).subscribe({
          next: () => {
            this.toastService.success('Tipo de horometro eliminado');
            this.horometros = this.horometros.filter((h) => h.id !== item.id);
            this.aplicarFiltros();
          },
          error: () => {
            this.toastService.error('No se pudo eliminar el tipo de horometro');
          },
        });
      },
    );
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    this.horometrosFiltrados = this.horometros.filter((item) =>
      item.nombre.toLowerCase().includes(texto),
    );
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.aplicarFiltros();
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.editingId = null;
  }

  get tituloDialog(): string {
    return this.editingId === null ? 'Nuevo tipo de horometro' : 'Editar tipo de horometro';
  }
}
