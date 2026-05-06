import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExplosivoService } from '../../../services/explosivo.service';
import { AccesorioService } from '../../../services/accesorio.service';
import { ExplosivosUniService } from '../../../services/explosivos-uni.service';
import { NumeroRetardosService } from '../../../services/numero-retardos.service';

@Component({
  selector: 'app-explosivos',
  imports: [FormsModule, CommonModule],
  templateUrl: './explosivos.component.html',
  styleUrl: './explosivos.component.css',
})
export class ExplosivosComponent implements OnInit {
  modalAbierto = false;
  modalContenido: any = null;
  nuevoDato: any = {};
  formularioActivo: string = 'botones';
  years: number[] = [];
  meses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  datos = [
    { nombre: 'Reporte A', year: '2024', mes: 'Enero' },
    { nombre: 'Reporte B', year: '2024', mes: 'Enero' },
    { nombre: 'Reporte C', year: '2024', mes: 'Enero' },
  ];

tipos: string[] = [];
longitudes: number[] = [];

private retardosOriginales: any[] = [];

  constructor(
    private explosivoService: ExplosivoService,
    private accesorioService: AccesorioService,
    private ExplosivosUniService: ExplosivosUniService,
    private numeroRetardosService: NumeroRetardosService,
    // private DestinatarioCorreoService: DestinatarioCorreoService
  ) {} // Inyecta el servicio

  ngOnInit() {
    this.generarAños();
  }

  actualizarLongitudes() {

  const tipoSeleccionado = this.nuevoDato.tipo;

  if (!tipoSeleccionado) return;

  const filtrados = this.retardosOriginales.filter(
    (x: any) => x.tipo === tipoSeleccionado
  );

  this.longitudes = [
    ...new Set(filtrados.map((x: any) => x.dato))
  ];

  const campoLongitud = this.modalContenido.campos.find(
    (c: any) => c.nombre === 'longitud'
  );

  if (campoLongitud) {
    campoLongitud.opciones = this.longitudes;
  }
}

  generarAños() {
    const yearActual = new Date().getFullYear();
    for (let i = 2020; i <= yearActual; i++) {
      this.years.push(i);
    }
  }

  mostrarFormulario(formulario: string): void {
    this.formularioActivo = formulario;
  }

  buttonc = [
    {
      nombre: 'Explosivos',
      icon: 'mas.svg',
      tipo: 'explosivo',
      datos: [],
      campos: [
        { nombre: 'tipo_explosivo', label: 'Tipo de Explosivo', tipo: 'text' },
        {
          nombre: 'cantidad_por_caja',
          label: 'Cantidad por Caja',
          tipo: 'number',
        },
        { nombre: 'peso_unitario', label: 'Peso Unitario', tipo: 'number' },
        { nombre: 'costo_por_kg', label: 'Costo por KG', tipo: 'number' },
        {
          nombre: 'unidad_medida',
          label: 'Unidad de Medida',
          tipo: 'select',
          opciones: ['kg', 'unidad', 'litros', 'metros'],
        },
      ],
    },
    {
      nombre: 'Accesorios',
      icon: 'mas.svg',
      tipo: 'accesorio',
      datos: [],
      campos: [
        { nombre: 'tipo_accesorio', label: 'Tipo de Accesorio', tipo: 'text' },
        { nombre: 'costo', label: 'Costo', tipo: 'number' },
        {
          nombre: 'unidad_medida',
          label: 'Unidad de Medida',
          tipo: 'select',
          opciones: ['kg', 'unidad', 'litros', 'metros'],
        },
      ],
    },
    {
      nombre: 'Retardos',
      icon: 'mas.svg',
      tipo: 'Retardos',
      datos: [], // Aquí se almacenarán los datos dinámicos obtenidos del backend
      campos: [
        { nombre: 'dato', label: 'Dato', tipo: 'number' }, // Campo obligatorio según el modelo
        {
          nombre: 'tipo',
          label: 'Tipo',
          tipo: 'select',
          opciones: ['Milisegundo', 'Medio Segundo'], // Opciones disponibles en el select
        },
      ],
    },
    {
  nombre: 'Numeros retardos',
  icon: 'mas.svg',
  tipo: 'Numeros retardos',
  datos: [],
  campos: [
    {
      nombre: 'tipo',
      label: 'Tipo',
      tipo: 'select',
      opciones: this.tipos // 👈 debes definir esto
    },
    {
      nombre: 'longitud',
      label: 'Longitud',
      tipo: 'select',
      opciones: this.longitudes // 👈 debes definir esto
    },
    {
      nombre: 'codigo',
      label: 'Código',
      tipo: 'text'
    }
  ],
}
    // {
    //   nombre: 'Destinatarios de Despacho',
    //   icon: 'mas.svg',
    //   tipo: 'Destinatarios de Despacho',
    //   datos: [], // Aquí se almacenarán los datos dinámicos obtenidos del backend
    //   campos: [
    //     { nombre: 'nombre', label: 'Nombre', tipo: 'text' }, // Campo obligatorio
    //     { nombre: 'correo', label: 'Correo Electrónico', tipo: 'email' } // Campo obligatorio
    //   ]
    // }
  ];

  abrirModal(button: any) {
    this.modalAbierto = true;
    this.modalContenido = button;

    if (button.tipo === 'explosivo') {
      this.explosivoService.getExplosivos().subscribe({
        next: (data) => {
          this.modalContenido.datos = data; // Asigna los datos recibidos
        },
        error: (err) => console.error('Error al cargar explosivos:', err),
      });
    } else if (button.tipo === 'accesorio') {
      this.accesorioService.getAccesorios().subscribe({
        next: (data) => {
          this.modalContenido.datos = data; // Asigna los datos recibidos
        },
        error: (err) => console.error('Error al cargar accesorios:', err),
      });
    } else if (button.tipo === 'Retardos') {
      this.ExplosivosUniService.getExplosivos().subscribe({
        next: (data) => {
          this.modalContenido.datos = data; // Asigna los datos recibidos
        },
        error: (err) => console.error('Error al cargar accesorios:', err),
      });
    } else if (button.tipo === 'Numeros retardos') {

  // TABLA INFERIOR
  this.numeroRetardosService.getAll().subscribe({
    next: (data) => {
      this.modalContenido.datos = data;
    },
    error: (err) => console.error('Error al cargar retardos:', err),
  });

  // SELECTS DINÁMICOS
  this.ExplosivosUniService.getExplosivos().subscribe({
    next: (data) => {

      this.retardosOriginales = data;

      // TIPOS ÚNICOS
      this.tipos = [...new Set(data.map((x: any) => x.tipo))];

      // ACTUALIZAR OPCIONES DEL SELECT TIPO
      const campoTipo = this.modalContenido.campos.find(
        (c: any) => c.nombre === 'tipo'
      );

      if (campoTipo) {
        campoTipo.opciones = this.tipos;
      }

      // INICIALMENTE VACÍO
      const campoLongitud = this.modalContenido.campos.find(
        (c: any) => c.nombre === 'longitud'
      );

      if (campoLongitud) {
        campoLongitud.opciones = [];
      }

    },
    error: (err) => console.error('Error al cargar tipos:', err),
  });
}
    // else if (button.tipo === 'Destinatarios de Despacho') {
    //   this.DestinatarioCorreoService.getDestinatarios().subscribe({
    //     next: (data) => {
    //       this.modalContenido.datos = data; // Asigna los datos recibidos

    //     },
    //     error: (err) => console.error('Error al cargar accesorios:', err)
    //   });
    // }
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.modalContenido = null;
  }

  guardarDatos() {
    if (Object.values(this.nuevoDato).some((val) => val !== '')) {
      const nuevoRegistro = { ...this.nuevoDato };

      if (this.modalContenido.tipo === 'explosivo') {
        this.explosivoService.createExplosivo(nuevoRegistro).subscribe({
          next: (data) => {
            this.modalContenido.datos.push(data);
          },
          error: (err) => console.error('Error al guardar explosivo:', err),
        });
      } else if (this.modalContenido.tipo === 'accesorio') {
        this.accesorioService.createAccesorio(nuevoRegistro).subscribe({
          next: (data) => {
            this.modalContenido.datos.push(data);
          },
          error: (err) => console.error('Error al guardar accesorio:', err),
        });
      } else if (this.modalContenido.tipo === 'Retardos') {
        this.ExplosivosUniService.createExplosivo(nuevoRegistro).subscribe({
          next: (data) => {
            this.modalContenido.datos.push(data);
          },
          error: (err) => console.error('Error al guardar accesorio:', err),
        });
      } else if (this.modalContenido.tipo === 'Numeros retardos') {
        this.numeroRetardosService.create(nuevoRegistro).subscribe({
          next: (data) => {
            this.modalContenido.datos.push(data);
          },
          error: (err) => console.error('Error al guardar retardos:', err),
        });
      }
      // else if (this.modalContenido.tipo === 'Destinatarios de Despacho') {
      //   this.DestinatarioCorreoService.createDestinatario(nuevoRegistro).subscribe({

      //     next: (data) => {
      //       this.modalContenido.datos.push(data);

      //     },
      //     error: (err) => console.error('Error al guardar accesorio:', err)
      //   });
      // }

      this.nuevoDato = {};
    }
  }

  eliminar(item: any): void {
    if (!item || !this.modalContenido) return;

    if (this.modalContenido.tipo === 'explosivo') {
      this.explosivoService.deleteExplosivo(item.id).subscribe({
        next: () => {
          this.modalContenido.datos = this.modalContenido.datos.filter(
            (dato: any) => dato.id !== item.id,
          );
        },
        error: (err) => console.error('Error al eliminar :', err),
      });
    } else if (this.modalContenido.tipo === 'accesorio') {
      this.accesorioService.deleteAccesorio(item.id).subscribe({
        next: () => {
          this.modalContenido.datos = this.modalContenido.datos.filter(
            (dato: any) => dato.id !== item.id,
          );
        },
        error: (err) => console.error('Error al eliminar :', err),
      });
    } else if (this.modalContenido.tipo === 'Retardos') {
      this.ExplosivosUniService.deleteExplosivo(item.id).subscribe({
        next: () => {
          this.modalContenido.datos = this.modalContenido.datos.filter(
            (dato: any) => dato.id !== item.id,
          );
        },
        error: (err) => console.error('Error al eliminar :', err),
      });
    } else if (this.modalContenido.tipo === 'Numeros retardos') {
      this.numeroRetardosService.delete(item.id).subscribe({
        next: () => {
          this.modalContenido.datos = this.modalContenido.datos.filter(
            (dato: any) => dato.id !== item.id,
          );
        },
        error: (err) => console.error('Error al eliminar retardos:', err),
      });
    }
    // else if (this.modalContenido.tipo === 'Destinatarios de Despacho') {
    //   this.DestinatarioCorreoService.deleteDestinatario(item.id).subscribe({
    //     next: () => {
    //       this.modalContenido.datos = this.modalContenido.datos.filter((dato: any) => dato.id !== item.id);

    //     },
    //     error: (err) => console.error('Error al eliminar :', err)
    //   });
    // }
  }

  descargar(item: any): void {}
}
