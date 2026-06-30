import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Equipo, EquipoHorometro } from '../../../../models/Equipo';
import { Proceso } from '../../../../models/Proceso';
import { ConfirmService } from '../../../../services/confirm.service';
import { EquipoService } from '../../../../services/equipo.service';
import { HorometroService } from '../../../../services/horometro.service';
import { ProcesosService } from '../../../../services/procesos.service';
import { ToastService } from '../../../../services/toast.service';

type EquipoView = Omit<Equipo, 'anioFabricacion' | 'fechaIngreso' | 'proceso_id'> & {
  anioFabricacion: number | null;
  fechaIngreso: Date | string | null;
  proceso_id: number | null;
};

type EquipoForm = {
  nombre: string;
  codigo: string;
  marca: string;
  modelo: string;
  serie: string;
  anioFabricacion: number | null;
  fechaIngreso: Date | null;
  capacidadYd3: number | null;
  capacidadM3: number | null;
  proceso_id: number | null;
  horometro_ids: number[];
};

@Component({
  selector: 'app-equipos-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    DialogModule,
    InputTextModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    SelectModule,
    TableModule,
  ],
  templateUrl: './equipos-page.component.html',
  styleUrl: './equipos-page.component.css'
})
export class EquiposPageComponent implements OnInit {
  private readonly equipoService = inject(EquipoService);
  private readonly horometroService = inject(HorometroService);
  private readonly procesosService = inject(ProcesosService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);

  equipos: EquipoView[] = [];
  equiposFiltrados: EquipoView[] = [];
  procesos: Proceso[] = [];
  horometrosDisponibles: EquipoHorometro[] = [];

  loading = false;
  loadingHorometros = false;
  loadingProcesos = false;
  saving = false;
  dialogVisible = false;
  editingEquipoId: number | null = null;

  busqueda = '';
  procesoFiltro = '';

  form: EquipoForm = this.crearFormularioInicial();

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    this.cargarProcesos();
    this.cargarHorometros();
    this.cargarEquipos();
  }

  cargarHorometros(): void {
    this.loadingHorometros = true;
    this.horometroService
      .getHorometros()
      .pipe(finalize(() => (this.loadingHorometros = false)))
      .subscribe({
        next: (horometros) => {
          this.horometrosDisponibles = horometros;
        },
        error: () => {
          this.toastService.error('No se pudieron cargar los horometros');
        },
      });
  }

  cargarProcesos(): void {
    this.loadingProcesos = true;
    this.procesosService
      .getProcesos()
      .pipe(finalize(() => (this.loadingProcesos = false)))
      .subscribe({
        next: (procesos) => {
          this.procesos = procesos;
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error('No se pudieron cargar los procesos');
        },
      });
  }

  cargarEquipos(): void {
    this.loading = true;
    this.equipoService
      .getEquipos()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (equipos) => {
          this.equipos = equipos.map((equipo) => this.normalizarEquipo(equipo));
          this.aplicarFiltros();
        },
        error: () => {
          this.toastService.error('No se pudieron cargar los equipos', 'Revisa la conexion con el backend.');
        },
      });
  }

  abrirNuevoEquipo(): void {
    this.editingEquipoId = null;
    this.form = this.crearFormularioInicial();
    this.dialogVisible = true;
  }

  editarEquipo(equipo: EquipoView): void {
    this.editingEquipoId = equipo.id;
    this.form = {
      nombre: equipo.nombre,
      codigo: equipo.codigo,
      marca: equipo.marca,
      modelo: equipo.modelo,
      serie: equipo.serie,
      anioFabricacion: equipo.anioFabricacion,
      fechaIngreso: this.parseFecha(equipo.fechaIngreso),
      capacidadYd3: equipo.capacidadYd3 ?? null,
      capacidadM3: equipo.capacidadM3 ?? null,
      proceso_id: equipo.proceso_id ?? this.obtenerProcesoIdPorNombre(equipo.proceso),
      horometro_ids: (equipo.horometros ?? []).map((horometro) => horometro.id),
    };
    this.dialogVisible = true;
  }

  guardarEquipo(): void {
    const nombre = this.form.nombre.trim();
    const codigo = this.form.codigo.trim();
    const procesoId = this.form.proceso_id;
    const procesoNombre = this.obtenerProcesoNombre(procesoId);

    if (!nombre || !codigo || procesoId === null || !procesoNombre) {
      this.toastService.warn(
        'Campos requeridos',
        'Completa nombre, codigo y proceso antes de guardar.'
      );
      return;
    }

    const payload = {
      nombre,
      proceso: procesoNombre,
      codigo,
      marca: this.form.marca.trim(),
      modelo: this.form.modelo.trim(),
      serie: this.form.serie.trim(),
      anioFabricacion: this.normalizarNumero(this.form.anioFabricacion),
      fechaIngreso: this.formatearFecha(this.form.fechaIngreso),
      capacidadYd3: this.normalizarDecimal(this.form.capacidadYd3),
      capacidadM3: this.normalizarDecimal(this.form.capacidadM3),
      proceso_id: procesoId,
      horometro_ids: this.form.horometro_ids,
    };

    this.saving = true;

    const request = this.editingEquipoId === null
      ? this.equipoService.createEquipo(payload as never)
      : this.equipoService.updateEquipo(this.editingEquipoId, payload as never);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.toastService.success(
          this.editingEquipoId === null ? 'Equipo creado' : 'Equipo actualizado'
        );
        this.dialogVisible = false;
        this.cargarEquipos();
      },
      error: () => {
        this.toastService.error(
          this.editingEquipoId === null ? 'No se pudo crear el equipo' : 'No se pudo actualizar el equipo'
        );
      },
    });
  }

  eliminarEquipo(equipo: EquipoView): void {
    this.confirmService.confirmDelete(
      `Se eliminara el equipo ${equipo.nombre}. Esta accion no se puede deshacer.`,
      () => {
        this.equipoService.deleteEquipo(equipo.id).subscribe({
          next: () => {
            this.toastService.success('Equipo eliminado');
            this.equipos = this.equipos.filter((item) => item.id !== equipo.id);
            this.aplicarFiltros();
          },
          error: () => {
            this.toastService.error('No se pudo eliminar el equipo');
          },
        });
      }
    );
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    this.equiposFiltrados = this.equipos.filter((equipo) => {
      const proceso = equipo.proceso ?? this.obtenerProcesoNombre(equipo.proceso_id) ?? '';

      if (this.procesoFiltro && proceso !== this.procesoFiltro) {
        return false;
      }

      if (!texto) {
        return true;
      }

      return [equipo.nombre, equipo.codigo, equipo.marca, equipo.modelo, proceso]
        .concat((equipo.horometros ?? []).map((horometro) => horometro.nombre))
        .filter(Boolean)
        .some((valor) => String(valor).toLowerCase().includes(texto));
    });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.procesoFiltro = '';
    this.aplicarFiltros();
  }

  cerrarDialog(): void {
    this.dialogVisible = false;
    this.editingEquipoId = null;
  }

  get tituloDialog(): string {
    return this.editingEquipoId === null ? 'Nuevo equipo' : 'Editar equipo';
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

  getProcesoLabel(equipo: EquipoView): string {
    return equipo.proceso ?? this.obtenerProcesoNombre(equipo.proceso_id) ?? 'Sin proceso';
  }

  getFechaIngresoLabel(fecha: Date | string | null): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    const parsed = this.parseFecha(fecha);

    if (!parsed) {
      return 'Sin fecha';
    }

    return parsed.toLocaleDateString('es-PE');
  }

  getCapacidadLabel(valor: number | null | undefined, unidad: string): string {
    return valor === null || valor === undefined ? `Sin ${unidad}` : `${valor} ${unidad}`;
  }

  getHorometrosLabel(horometros: EquipoHorometro[] | undefined): string {
    if (!horometros?.length) {
      return 'Sin horometros';
    }

    return horometros.map((horometro) => horometro.nombre).join(', ');
  }

  private crearFormularioInicial(): EquipoForm {
    return {
      nombre: '',
      codigo: '',
      marca: '',
      modelo: '',
      serie: '',
      anioFabricacion: null,
      fechaIngreso: null,
      capacidadYd3: null,
      capacidadM3: null,
      proceso_id: null,
      horometro_ids: [],
    };
  }

  private normalizarEquipo(equipo: Equipo): EquipoView {
    return {
      id: Number(equipo.id),
      nombre: String(equipo.nombre ?? ''),
      proceso: String(equipo.proceso ?? ''),
      codigo: String(equipo.codigo ?? ''),
      marca: String(equipo.marca ?? ''),
      modelo: String(equipo.modelo ?? ''),
      serie: String(equipo.serie ?? ''),
      anioFabricacion: this.normalizarNumero(equipo.anioFabricacion),
      fechaIngreso: this.normalizarFechaEntrada(equipo.fechaIngreso),
      capacidadYd3: this.normalizarDecimal(equipo.capacidadYd3),
      capacidadM3: this.normalizarDecimal(equipo.capacidadM3),
      proceso_id: this.normalizarNumero(equipo.proceso_id) ?? this.obtenerProcesoIdPorNombre(equipo.proceso),
      horometros: Array.isArray(equipo.horometros)
        ? equipo.horometros.map((horometro) => ({
            id: Number(horometro.id),
            nombre: String(horometro.nombre ?? ''),
          }))
        : [],
    };
  }

  private normalizarFechaEntrada(valor: unknown): Date | string | null {
    if (!valor) {
      return null;
    }

    if (valor instanceof Date) {
      return valor;
    }

    if (typeof valor === 'string') {
      return valor;
    }

    return null;
  }

  private parseFecha(valor: Date | string | null): Date | null {
    if (!valor) {
      return null;
    }

    if (valor instanceof Date) {
      return Number.isNaN(valor.getTime()) ? null : valor;
    }

    const parsed = new Date(valor);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }

    const parsedDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(valor)
      ? new Date(`${valor}T00:00:00`)
      : null;

    return parsedDateOnly && !Number.isNaN(parsedDateOnly.getTime())
      ? parsedDateOnly
      : null;
  }

  private formatearFecha(valor: Date | null): string | null {
    if (!valor) {
      return null;
    }

    const year = valor.getFullYear();
    const month = String(valor.getMonth() + 1).padStart(2, '0');
    const day = String(valor.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private normalizarNumero(valor: unknown): number | null {
    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    const numero = Number(valor);
    return Number.isNaN(numero) ? null : numero;
  }

  private normalizarDecimal(valor: unknown): number | null {
    return this.normalizarNumero(valor);
  }

  private obtenerProcesoNombre(procesoId: number | null): string | null {
    if (procesoId === null) {
      return null;
    }

    return this.procesos.find((proceso) => proceso.id === procesoId)?.nombre ?? null;
  }

  private obtenerProcesoIdPorNombre(nombreProceso: unknown): number | null {
    if (typeof nombreProceso !== 'string' || !nombreProceso.trim()) {
      return null;
    }

    return this.procesos.find((proceso) => proceso.nombre === nombreProceso)?.id ?? null;
  }
}
