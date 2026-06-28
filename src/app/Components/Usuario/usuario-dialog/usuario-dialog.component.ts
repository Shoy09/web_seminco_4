import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { Usuario } from '../../../models/Usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { ProcesosService } from '../../../services/procesos.service';
import { Proceso } from '../../../models/Proceso';
import { CargosService } from '../../../services/cargos.service';
import { Cargo } from '../../../models/Cargo';
import { RolesService } from '../../../services/roles.service';
import { Rol } from '../../../models/Rol';
import { EquipoService } from '../../../services/equipo.service';
import { ToastService } from '../../../services/toast.service';
import { Equipo } from '../../../models/Equipo';

@Component({
  selector: 'app-usuario-dialog',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    MultiSelectModule,
    PasswordModule,
    DialogModule,
  ],
  templateUrl: './usuario-dialog.component.html',
  styleUrl: './usuario-dialog.component.css',
})
export class UsuarioDialogComponent implements OnInit {
  @Input() data: Usuario | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  dialogVisible = true;
  editMode = false;
  procesosDisponibles: Proceso[] = [];
  cargosDisponibles: Cargo[] = [];
  rolesDisponibles: Rol[] = [];
  equiposDisponibles: Equipo[] = [];
  usuarioForm;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private procesosService: ProcesosService,
    private cargosService: CargosService,
    private rolService: RolesService,
    private equipoService: EquipoService,
    private toastService: ToastService,
  ) {
    this.usuarioForm = this.fb.group(
      {
        codigo_dni: ['', Validators.required],
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        cargo_id: [null as number | null, Validators.required],
        rol_id: [null as number | null, Validators.required],
        proceso_ids: [[] as number[]],
        equipo_ids: [[] as number[]],
        password: ['', [Validators.minLength(6)]],
        confirmPassword: [''],
      },
      { validators: this.passwordsCoinciden },
    );
  }

  ngOnInit() {
    this.procesosService.getProcesos().subscribe((procesos) => {
      this.procesosDisponibles = procesos;
    });
    this.cargosService.getCargos().subscribe((cargos) => {
      this.cargosDisponibles = cargos;
    });
    this.rolService.getRoles().subscribe((roles) => {
      this.rolesDisponibles = roles;
    });
    this.equipoService.getEquipos().subscribe((equipos) => {
      this.equiposDisponibles = equipos;
    });

    if (this.data) {
      this.editMode = true;
      this.usuarioForm.patchValue({
        codigo_dni: this.data.codigo_dni,
        nombres: this.data.nombres,
        apellidos: this.data.apellidos,
        cargo_id: this.data.cargo_id ?? null,
        rol_id: this.data.rol_id ?? null,
        proceso_ids: Array.isArray(this.data.procesos)
          ? this.data.procesos.map((p: any) => p.id ?? p)
          : (this.data.proceso_ids ?? []),
        equipo_ids: Array.isArray(this.data.equipos)
          ? (this.data).equipos.map((e: any) => e.id ?? e)
          : [],
      });
    }
  }

  guardar() {
    if (this.usuarioForm.invalid) return;

    const formValue = this.usuarioForm.value;
    const payload: Record<string, any> = { ...formValue };
    delete payload['confirmPassword'];

    const request = this.editMode
      ? this.usuarioService.actualizarUsuario(this.data!.id!, payload as any)
      : this.usuarioService.crearUsuario(payload as any);

    request.subscribe(() => {
      this.saved.emit();
      this.toastService.success('Usuario guardado correctamente');
    });
  }

  cancelar() {
    this.dialogVisible = false;
  }

  onHide() {
    this.closed.emit();
  }

  private passwordsCoinciden(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { noCoincide: true };
  }
}
