import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Usuario } from '../../../models/Usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-usuario-dialog',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './usuario-dialog.component.html',
  styleUrl: './usuario-dialog.component.css'
})
export class UsuarioDialogComponent {
  usuarioForm: FormGroup;
  editMode = false;

  operacionesDisponibles = [
    'ACARREO',
    'CARGUÍO',
    'EXPLOSIVOS',
    'MEDICIONES',
    'SOSTENIMIENTO',
    'SERVICIOS AUXILIARES',
    'ACEROS DE PERFORACIÓN',
    'PERFORACIÓN HORIZONTAL',
    'PERFORACIÓN TALADROS LARGOS'
  ];

  cargos: string[] = [
    'JEFE GUARDIA',
    'Op. Robot',
    'Op. Bolter',
    'Op. Mixer',
    'Ayudante'
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<UsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) {

    this.editMode = !!data;

    let operacionesSeleccionadas: string[] = [];

    if (data?.operaciones_autorizadas) {

      let operaciones = data.operaciones_autorizadas;

      if (typeof operaciones === 'string') {
        try {
          operaciones = JSON.parse(operaciones);
        } catch (e) {
          operaciones = {};
        }
      }

      operacionesSeleccionadas = Object.keys(operaciones)
        .filter(key => operaciones[key]);
    }

    this.usuarioForm = this.fb.group(
      {
        codigo_dni: [
          data?.codigo_dni || '',
          Validators.required
        ],

        apellidos: [
          data?.apellidos || '',
          Validators.required
        ],

        nombres: [
          data?.nombres || '',
          Validators.required
        ],

        correo: [
          data?.correo || '',
          [Validators.required, Validators.email]
        ],

        cargo: [data?.cargo || ''],

        empresa: [data?.empresa || ''],

        guardia: [data?.guardia || ''],

        autorizado_equipo: [
          data?.autorizado_equipo || ''
        ],

        rol: [
          data?.rol || '',
          Validators.required
        ],

        operaciones_autorizadas: [
          operacionesSeleccionadas
        ],

        password: [
          '',
          this.editMode
            ? []
            : [
                Validators.required,
                Validators.minLength(6)
              ]
        ],

        confirmPassword: [
          '',
          this.editMode
            ? []
            : [
                Validators.required,
                Validators.minLength(6)
              ]
        ]
      },
      {
        validators: this.passwordsCoinciden
      }
    );
  }

  passwordsCoinciden(form: FormGroup) {

    const password =
      form.get('password')?.value;

    const confirmPassword =
      form.get('confirmPassword')?.value;

    if (!password && !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { noCoincide: true };
  }

  guardar() {

    if (!this.usuarioForm.valid) {
      return;
    }

    const formValue = this.usuarioForm.value;

    const operacionesObj: {
      [key: string]: boolean;
    } = {};

    if (
      Array.isArray(
        formValue.operaciones_autorizadas
      )
    ) {
      formValue.operaciones_autorizadas.forEach(
        (op: string) => {
          operacionesObj[op] = true;
        }
      );
    }

    const usuarioData: any = {
      ...formValue,
      operaciones_autorizadas: operacionesObj
    };

    delete usuarioData.confirmPassword;

    if (
      !usuarioData.password ||
      usuarioData.password.trim() === ''
    ) {
      delete usuarioData.password;
    }

    if (this.editMode) {

      this.usuarioService
        .actualizarUsuario(
          this.data.id!,
          usuarioData
        )
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error(
              'Error actualizando usuario',
              err
            );
          }
        });

    } else {

      this.usuarioService
        .crearUsuario(usuarioData)
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error(
              'Error creando usuario',
              err
            );
          }
        });
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}