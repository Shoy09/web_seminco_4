import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Proceso } from '../../../../models/Proceso';
import { TipoPerforacion } from '../../../../models/tipo-perforacion.model';
import { ConfirmService } from '../../../../services/confirm.service';
import { ProcesosService } from '../../../../services/procesos.service';
import { TipoPerforacionService } from '../../../../services/tipo-perforacion.service';
import { ToastService } from '../../../../services/toast.service';

type TipoPerforacionForm = {
  nombre: string;
  proceso_id: number | null;
  permitido_medicion: number;
};

@Component({
  selector: 'app-tipo-perforaciones-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ProgressSpinnerModule,
    SelectModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './tipo-perforaciones-page.component.html',
  styleUrl: './tipo-perforaciones-page.component.css',
})
export class TipoPerforacionesPageComponent implements OnInit {
  private readonly tipoPerforacionService = inject(TipoPerforacionService);
  private readonly procesosService = inject(ProcesosService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);

  tiposPerforacion: TipoPerforacion[] = [];
  tiposPerforacionFiltrados: TipoPerforacion[] = [];
  procesos: Proceso[] = [];

  loading = false;
  loadingProcesos = false;
  saving = false;
  dialogVisible = false;
  editingTipoId: number | null = null;

  busqueda = '';
  procesoFiltro = '';
  medicionFiltro: number | '' = '';

  readonly medicionOptions = [
    { label: 'Todos', value: '' },
    { label: 'Permitido', value: 1 },
    { label: 'No permitido', value: 0 },
  ];

  form: TipoPerforacionForm = {
    nombre: '',
    proceso_id: null,
    permitido_medicion: 0,
  };

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    this.cargarProcesos();
    this.cargarTiposPerforacion();
  }

  cargarProcesos(): void {
    this.loadingProcesos = true;
    this.procesosService
      .getProcesos()
      .pipe(finalize(() => (this.loadingProcesos = false)))
      .subscribe({
        next: (procesos) => {
          this.procesos = procesos;
        },
        error: () => {
          this.toastService.error('No se pudieron cargar los procesos');
        },
      });
  }

  cargarTiposPerforacion(): void {
    this.loading = true;
    this.tipoPerforacionService
      .getTiposPerforacion()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (tipos) => {
          this.tiposPerforacion = tipos;
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error(
            'No se pudieron cargar los tipos de perforacion',
            'Revisa la conexion con el backend.'
          );
        },
      });
  }

  abrirNuevoTipo(): void {
    this.editingTipoId = null;
    this.form = {
      nombre: '',
      proceso_id: null,
      permitido_medicion: 0,
    };
    this.dialogVisible = true;
  }

  editarTipo(tipo: TipoPerforacion): void {
    this.editingTipoId = tipo.id;
    this.form = {
      nombre: tipo.nombre,
      proceso_id: tipo.proceso_id ?? this.obtenerProcesoIdPorNombre(tipo.proceso),
      permitido_medicion: tipo.permitido_medicion,
    };
    this.dialogVisible = true;
  }

  guardarTipo(): void {
    const nombre = this.form.nombre.trim();
    const procesoId = this.form.proceso_id;

    if (!nombre || procesoId === null) {
      this.toastService.warn(
        'Campos requeridos',
        'Completa el nombre y selecciona un proceso antes de guardar.'
      );
      return;
    }

    const payload = {
      nombre,
      proceso_id: procesoId,
      permitido_medicion: this.form.permitido_medicion,
    };

    this.saving = true;

    const request = this.editingTipoId === null
      ? this.tipoPerforacionService.createTipoPerforacion(payload)
      : this.tipoPerforacionService.updateTipoPerforacion(this.editingTipoId, payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(
          this.editingTipoId === null
            ? 'Tipo de perforacion creado'
            : 'Tipo de perforacion actualizado'
        );
        this.dialogVisible = false;
        this.cargarTiposPerforacion();
      },
      error: () => {
        this.toastService.error(
          this.editingTipoId === null
            ? 'No se pudo crear el tipo de perforacion'
            : 'No se pudo actualizar el tipo de perforacion'
        );
      },
    });
  }

  eliminarTipo(tipo: TipoPerforacion): void {
    this.confirmService.confirmDelete(
      `Se eliminara el tipo de perforacion ${tipo.nombre}. Esta accion no se puede deshacer.`,
      () => {
        this.tipoPerforacionService.deleteTipoPerforacion(tipo.id).subscribe({
          next: () => {
            this.toastService.success('Tipo de perforacion eliminado');
            this.tiposPerforacion = this.tiposPerforacion.filter((item) => item.id !== tipo.id);
            this.aplicarFiltros();
          },
          error: () => {
            this.toastService.error('No se pudo eliminar el tipo de perforacion');
          },
        });
      }
    );
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    this.tiposPerforacionFiltrados = this.tiposPerforacion.filter((tipo) => {
      if (this.procesoFiltro && tipo.proceso !== this.procesoFiltro) {
        return false;
      }

      if (this.medicionFiltro !== '' && tipo.permitido_medicion !== this.medicionFiltro) {
        return false;
      }

      if (!texto) {
        return true;
      }

      return [tipo.nombre, tipo.proceso]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(texto));
    });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.procesoFiltro = '';
    this.medicionFiltro = '';
    this.aplicarFiltros();
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.editingTipoId = null;
  }

  get tituloDialog(): string {
    return this.editingTipoId === null
      ? 'Nuevo tipo de perforacion'
      : 'Editar tipo de perforacion';
  }

  get procesoOptions(): Array<{ label: string; value: number }> {
    return this.procesos.map((proceso) => ({
      label: proceso.nombre,
      value: proceso.id,
    }));
  }

  get procesoFiltroOptions(): Array<{ label: string; value: string }> {
    return [
      { label: 'Todos los procesos', value: '' },
      ...this.procesos.map((proceso) => ({
        label: proceso.nombre,
        value: proceso.nombre,
      })),
    ];
  }

  getMedicionSeverity(value: number): 'success' | 'danger' {
    return value === 1 ? 'success' : 'danger';
  }

  getMedicionLabel(value: number): string {
    return value === 1 ? 'Permitido' : 'No permitido';
  }

  private obtenerProcesoIdPorNombre(nombreProceso: string): number | null {
    return this.procesos.find((proceso) => proceso.nombre === nombreProceso)?.id ?? null;
  }
}
