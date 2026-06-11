import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { OperacionBase } from '../../../../models/OperacionBase.models';
import { AuthService } from '../../../../services/auth-service.service';
import { OperacionesService } from '../../../../services/operaciones.service';
import { ToastService } from '../../../../services/toast.service';
import {
  VALIDACION_EQUIPOS,
  ValidacionEquipoConfig,
  getValidacionEquipoConfig,
} from '../../data/validacion-equipos';
import {
  getFechaActualIso,
  getTurnoActual,
  normalizeAprobacionStatus,
} from '../../utils/validacion-operacion.utils';

@Component({
  selector: 'app-monitoreo-validaciones-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    SelectModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './monitoreo-validaciones-page.component.html',
  styleUrl: './monitoreo-validaciones-page.component.css',
})
export class MonitoreoValidacionesPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly operacionesService = inject(OperacionesService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  readonly equipos = VALIDACION_EQUIPOS;
  readonly turnos = [
    { label: 'Todos', value: '' },
    { label: 'Dia', value: 'DIA' },
    { label: 'Noche', value: 'NOCHE' },
  ];
  readonly estados = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'pending' },
    { label: 'Aprobado', value: 'approved' },
    { label: 'Rechazado', value: 'rejected' },
  ];

  equipoConfig?: ValidacionEquipoConfig;
  jefeGuardia = '';

  loading = false;
  operacionesOriginal: OperacionBase[] = [];
  operacionesFiltradas: OperacionBase[] = [];

  fechaInicio = getFechaActualIso();
  fechaFin = getFechaActualIso();
  turnoSeleccionado = getTurnoActual();
  aprobacionSeleccionada = '';
  busqueda = '';

  ngOnInit(): void {
    this.jefeGuardia = this.authService.getNombreCompleto() ?? '';

    this.route.paramMap.subscribe((params) => {
      this.equipoConfig = getValidacionEquipoConfig(params.get('equipo'));

      if (!this.equipoConfig) {
        this.toastService.error('Equipo invalido', 'La ruta de validacion no coincide con ningun equipo configurado.');
        this.router.navigate(['/validaciones/jefe-mina']);
        return;
      }

      this.cargarOperaciones();
    });
  }

  cargarOperaciones(): void {
    if (!this.equipoConfig) {
      return;
    }

    this.loading = true;
    this.operacionesService.getAll(this.equipoConfig.tipoApi).subscribe({
      next: (response) => {
        this.operacionesOriginal = response.data ?? [];
        this.aplicarFiltros();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('No se pudo cargar la bandeja', 'Revisa la conexion con operaciones-v2.');
      },
    });
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    this.operacionesFiltradas = this.operacionesOriginal.filter((operacion) => {
      if (this.fechaInicio && operacion.fecha < this.fechaInicio) return false;
      if (this.fechaFin && operacion.fecha > this.fechaFin) return false;

      const turnoNormalizado = this.normalizarTurno(operacion.turno);
      if (this.turnoSeleccionado && turnoNormalizado !== this.turnoSeleccionado) return false;

      if (
        this.aprobacionSeleccionada &&
        normalizeAprobacionStatus(operacion.aprobacion) !== this.aprobacionSeleccionada
      ) {
        return false;
      }

      if (!texto) return true;

      return [
        operacion.operador,
        operacion.jefe_guardia,
        operacion.equipo,
        operacion.n_equipo,
        operacion.seccion,
        operacion.modelo_equipo,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(texto));
    });
  }

  limpiarFiltros(): void {
    this.fechaInicio = getFechaActualIso();
    this.fechaFin = getFechaActualIso();
    this.turnoSeleccionado = getTurnoActual();
    this.aprobacionSeleccionada = '';
    this.busqueda = '';
    this.aplicarFiltros();
  }

  irDetalle(operacion: OperacionBase): void {
    if (!this.equipoConfig || !operacion.id) {
      return;
    }

    this.router.navigate([
      '/validaciones/jefe-mina',
      this.equipoConfig.slug,
      'operacion',
      operacion.id,
    ]);
  }

  getEstadoSeverity(aprobacion?: number): 'success' | 'danger' | 'warn' {
    const status = normalizeAprobacionStatus(aprobacion);
    if (status === 'approved') return 'success';
    if (status === 'rejected') return 'danger';
    return 'warn';
  }

  getEstadoLabel(aprobacion?: number): string {
    const status = normalizeAprobacionStatus(aprobacion);
    if (status === 'approved') return 'Aprobado';
    if (status === 'rejected') return 'Rechazado';
    return 'Pendiente';
  }

  getRevisionLabel(revisado?: number): string {
    const value = revisado ?? 0;
    if (value <= 0) return 'Sin revision';
    if (value === 1) return '1ra revision';
    if (value === 2) return '2da revision';
    return `${value} revisiones`;
  }

  totalPendientes(): number {
    return this.operacionesFiltradas.filter((item) => normalizeAprobacionStatus(item.aprobacion) === 'pending').length;
  }

  totalAprobadas(): number {
    return this.operacionesFiltradas.filter((item) => normalizeAprobacionStatus(item.aprobacion) === 'approved').length;
  }

  totalRechazadas(): number {
    return this.operacionesFiltradas.filter((item) => normalizeAprobacionStatus(item.aprobacion) === 'rejected').length;
  }

  private normalizarTurno(turno: string | undefined): 'DIA' | 'NOCHE' | '' {
    const value = String(turno ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toUpperCase();

    if (value.includes('DIA')) return 'DIA';
    if (value.includes('NOCHE')) return 'NOCHE';
    return '';
  }
}
