import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EstadoFormEditarComponent } from '../estado-form-editar/estado-form-editar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Estado } from '../../../models/Estado';
import { EstadoService } from '../../../services/estado.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProcesosService } from '../../../services/procesos.service';
import { Proceso } from '../../../models/Proceso';
import { CategoriaEstado } from '../../../models/CategoriaEstado';
@Component({
  selector: 'app-estados',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './estados.component.html',
  styleUrl: './estados.component.css',
})
export class EstadosComponent implements OnInit {
  displayedColumns: string[] = [
    'estado_principal',
    'codigo',
    'tipo_estado',
    'categoria',
    'proceso',
    'acciones',
  ];

  estados: Estado[] = [];
  categorias: CategoriaEstado[] = [];
  procesos: Proceso[] = [];
  filtroGlobal = '';
  categoriaSeleccionada: string | null = null;
  procesoSeleccionado: string | null = null;

  constructor(
    private estadoService: EstadoService,
    private procesosService: ProcesosService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getEstados();
    this.getCategoriasEstados();
    this.getProcesos();
    this.estadoService.getEstadoActualizado().subscribe((cambio) => {
      if (cambio) {
        this.getEstados(); // Recargar la tabla cuando haya cambios
      }
    });
  }

  getEstados(): void {
    this.estadoService.getEstados().subscribe(
      (data: Estado[]) => {
        this.estados = data;
      },
      (error: any) => {
        console.error('Error al obtener los estados', error);
      },
    );
  }

  getCategoriasEstados(): void {
    this.estadoService.getCategoriasEstados().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al obtener las categorias de estados', error);
      },
    });
  }

  getProcesos(): void {
    this.procesosService.getProcesos().subscribe({
      next: (data) => {
        this.procesos = data;
      },
      error: (error) => {
        console.error('Error al obtener los procesos', error);
      },
    });
  }

  abrirDialogoCrear(): void {
    const dialogRef = this.dialog.open(EstadoFormEditarComponent, {
      width: '700px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((estadoCreado) => {
      if (estadoCreado) {
        this.getEstados();
      }
    });
  }

  abrirDialogoEditar(estado: Estado): void {
    const dialogRef = this.dialog.open(EstadoFormEditarComponent, {
      width: '700px',
      data: estado, // Pasamos el estado seleccionado
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((estadoEditado) => {
      if (estadoEditado) {
        this.getEstados(); // Volver a cargar los estados si hubo cambios
      }
    });
  }

  aplicarFiltroCategoria(tabla: Table): void {
    tabla.filter(this.categoriaSeleccionada || null, 'categoria', 'equals');
  }

  aplicarFiltroProceso(tabla: Table): void {
    tabla.filter(this.procesoSeleccionado || null, 'proceso', 'equals');
  }

  limpiarFiltros(tabla: Table): void {
    this.filtroGlobal = '';
    this.categoriaSeleccionada = null;
    this.procesoSeleccionado = null;
    tabla.clear();
  }

  eliminarEstado(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { mensaje: '¿Estás seguro de que deseas eliminar este estado?' },
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.estadoService.deleteEstado(id).subscribe(
          () => {
            this.getEstados(); // Refrescar la lista después de eliminar
          },
          (error) => {
            console.error('Error al eliminar el estado', error);
          },
        );
      }
    });
  }

  abrirSeleccionProcesoDialogo() {
    this.abrirDialogoCrear();
  }

  // abrirDialogoOpciones() {
  //   const dialogRef = this.dialog.open(OpcionesDialogComponent, {
  //     width: '400px'
  //   });

  //   dialogRef.afterClosed().subscribe((opcion) => {
  //     if (opcion === 'estado') {
  //       this.abrirDialogo();
  //     } else if (opcion === 'excel') {
  //       this.abrirExploradorArchivos();
  //     }
  //   });
  // }
}
