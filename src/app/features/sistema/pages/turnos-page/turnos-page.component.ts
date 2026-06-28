import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { Turno } from '../../../../models/Turno';
import { ConfirmService } from '../../../../services/confirm.service';
import { ToastService } from '../../../../services/toast.service';
import { TurnoPayload, TurnoService } from '../../../../services/turno.service';

type TurnoForm = {
  nombre: string;
  codigo: string;
  horario_inicio: string;
  horario_fin: string;
  descripcion: string;
};

@Component({
  selector: 'app-turnos-page',
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
  templateUrl: './turnos-page.component.html',
  styleUrl: './turnos-page.component.css'
})
export class TurnosPageComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);

  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];

  loading = false;
  saving = false;
  dialogVisible = false;
  editingTurnoId: number | null = null;

  busqueda = '';

  form: TurnoForm = this.crearFormularioInicial();

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.loading = true;
    this.turnoService
      .getTurnos()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (turnos) => {
          this.turnos = turnos;
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error('No se pudieron cargar los turnos');
        },
      });
  }

  abrirNuevoTurno(): void {
    this.editingTurnoId = null;
    this.form = this.crearFormularioInicial();
    this.dialogVisible = true;
  }

  editarTurno(turno: Turno): void {
    this.editingTurnoId = turno.turnoId;
    this.form = {
      nombre: turno.nombre,
      codigo: turno.codigo,
      horario_inicio: turno.horario_inicio,
      horario_fin: turno.horario_fin,
      descripcion: turno.descripcion ?? '',
    };
    this.dialogVisible = true;
  }

  guardarTurno(): void {
    const payload = this.construirPayload();

    if (!payload) {
      this.toastService.warn(
        'Campos requeridos',
        'Completa nombre, codigo, horario de inicio y horario de fin antes de guardar.'
      );
      return;
    }

    this.saving = true;

    const request = this.editingTurnoId === null
      ? this.turnoService.createTurno(payload)
      : this.turnoService.updateTurno(this.editingTurnoId, payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(
          this.editingTurnoId === null ? 'Turno creado' : 'Turno actualizado'
        );
        this.dialogVisible = false;
        this.cargarTurnos();
      },
      error: () => {
        this.toastService.error(
          this.editingTurnoId === null ? 'No se pudo crear el turno' : 'No se pudo actualizar el turno'
        );
      },
    });
  }

  eliminarTurno(turno: Turno): void {
    this.confirmService.confirmDelete(
      `Se eliminara el turno ${turno.nombre}. Esta accion no se puede deshacer.`,
      () => {
        this.turnoService.deleteTurno(turno.turnoId).subscribe({
          next: () => {
            this.toastService.success('Turno eliminado');
            this.turnos = this.turnos.filter((item) => item.turnoId !== turno.turnoId);
            this.aplicarFiltros();
          },
          error: () => {
            this.toastService.error('No se pudo eliminar el turno');
          },
        });
      }
    );
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    this.turnosFiltrados = this.turnos.filter((turno) => {
      if (!texto) {
        return true;
      }

      return [turno.nombre, turno.codigo, turno.horario_inicio, turno.horario_fin, turno.descripcion ?? '']
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(texto));
    });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.aplicarFiltros();
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.editingTurnoId = null;
  }

  get tituloDialog(): string {
    return this.editingTurnoId === null ? 'Nuevo turno' : 'Editar turno';
  }

  private crearFormularioInicial(): TurnoForm {
    return {
      nombre: '',
      codigo: '',
      horario_inicio: '',
      horario_fin: '',
      descripcion: '',
    };
  }

  private construirPayload(): TurnoPayload | null {
    const nombre = this.form.nombre.trim();
    const codigo = this.form.codigo.trim();
    const horario_inicio = this.form.horario_inicio.trim();
    const horario_fin = this.form.horario_fin.trim();

    if (!nombre || !codigo || !horario_inicio || !horario_fin) {
      return null;
    }

    return {
      nombre,
      codigo,
      horario_inicio,
      horario_fin,
      descripcion: this.form.descripcion.trim() || null,
    };
  }
}
