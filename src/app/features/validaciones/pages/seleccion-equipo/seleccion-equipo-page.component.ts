import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { VALIDACION_EQUIPOS } from '../../data/validacion-equipos';

@Component({
  selector: 'app-seleccion-equipo-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule],
  templateUrl: './seleccion-equipo-page.component.html',
  styleUrl: './seleccion-equipo-page.component.css',
})
export class SeleccionEquipoPageComponent {
  readonly equipos = VALIDACION_EQUIPOS;
}
