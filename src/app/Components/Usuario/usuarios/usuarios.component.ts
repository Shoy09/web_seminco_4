import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { Usuario } from '../../../models/Usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { LoadingDialogComponent } from '../../Reutilizables/loading-dialog/loading-dialog.component';
import { OperacionesDialogComponent } from '../operaciones-dialog.component';
import { EditarOperacionesDialogComponent } from '../editar-operaciones-dialog/editar-operaciones-dialog.component';
import { UsuarioDialogComponent } from '../usuario-dialog/usuario-dialog.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastService } from '../../../services/toast.service';
import { ConfirmService } from '../../../services/confirm.service';
import { ChipModule } from 'primeng/chip';
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    FileUploadModule,
    ChipModule,
    UsuarioDialogComponent,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  showDialog = false;
  selectedUsuario: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService,
    public dialog: MatDialog,
    private toastService: ToastService,
    private confirmService: ConfirmService,
  ) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  abrirDialogoCrear() {
    this.selectedUsuario = null;
    this.showDialog = true;
  }

  cerrarDialogo() {
    this.showDialog = false;
    this.selectedUsuario = null;
    this.obtenerUsuarios();
  }

  abrirDialogoEditar(usuario: Usuario) {
    this.selectedUsuario = usuario;
    this.showDialog = true;
  }

  eliminarUsuario(id: number): void {
    this.confirmService.confirmDelete(
      '¿Estás seguro de que deseas eliminar este usuario?',
      () => {
        this.usuarioService.eliminarUsuario(id).subscribe({
          next: () => {
            this.toastService.success(
              'Usuario eliminado',
              'El usuario fue eliminado correctamente.',
            );

            this.obtenerUsuarios();
          },
          error: () => {
            this.toastService.error(
              'Error al eliminar',
              'No se pudo eliminar el usuario.',
            );
          },
        });
      },
    );
  }

  cargarArchivo(event: any): void {
    const archivo: File | undefined = event.files?.[0];
    if (!archivo) {
      this.toastService.warn(
        'Archivo no seleccionado',
        'Debe seleccionar un archivo Excel para continuar.',
      );
      return;
    }

    this.procesarArchivoExcel(archivo);
  }

  private procesarArchivoExcel(archivo: File): void {
    const reader = new FileReader();

    reader.readAsArrayBuffer(archivo);

    //

    reader.onerror = () => {
      alert('No se pudo leer el archivo Excel.');
    };
  }

  mostrarPantallaCarga() {
    this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    });
  }

  enviarUsuariosBulk(
    usuarios: Usuario[],
    usuariosInvalidos: { nombre: string; dni: string }[],
  ) {
    const dialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    });

    this.usuarioService.crearUsuariosBulk(usuarios).subscribe({
      next: (res) => {
        dialogRef.close();

        if (usuariosInvalidos.length > 0) {
          this.mostrarErrores(usuariosInvalidos);
        }

        alert(`✅ ${usuarios.length} usuarios procesados correctamente`);
        this.obtenerUsuarios();
      },
      error: (error) => {
        dialogRef.close();
        console.error(error);
        alert('❌ Error en carga masiva');
      },
    });
  }

  private verificarCompletado(
    procesados: number,
    total: number,
    dialogRef: MatDialogRef<LoadingDialogComponent>,
    usuariosInvalidos: { nombre: string; dni: string }[],
    errores: { nombre: string; dni: string; motivo?: string }[],
  ) {
    if (procesados === total) {
      dialogRef.close();
      // Combina usuarios inválidos del Excel con errores de la API
      const todosErrores = [...usuariosInvalidos, ...errores];
      if (todosErrores.length > 0) {
        this.mostrarErrores(todosErrores);
      }
      // Actualiza la lista de usuarios
      this.obtenerUsuarios();
    }
  }

  mostrarErrores(
    usuariosInvalidos: { nombre: string; dni: string; motivo?: string }[],
  ) {
    if (usuariosInvalidos.length > 0) {
      let mensaje = 'Errores en el registro:\n\n';
      usuariosInvalidos.forEach((usuario) => {
        mensaje += `• ${usuario.nombre} (DNI: ${usuario.dni}): ${
          usuario.motivo || 'Datos incompletos'
        }\n`;
      });
      alert(mensaje);
    }
  }

  abrirDialogoEdicion(
    usuarioId: number,
    operacionesAutorizadas: { [key: string]: boolean },
  ) {
    const dialogRef = this.dialog.open(EditarOperacionesDialogComponent, {
      width: '95vw',
      maxWidth: '1200px',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'editar-operaciones-dialog',
      data: {
        id: usuarioId,
        operacionesAutorizadas: operacionesAutorizadas,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'actualizado') {
        // ✅ Aquí llamas a la función que actualiza la tabla
        this.obtenerUsuarios(); // o como se llame tu función de recarga
      }
    });
  }
}
