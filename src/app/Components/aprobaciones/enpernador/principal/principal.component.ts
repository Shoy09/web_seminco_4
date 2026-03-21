import { Component, OnInit } from '@angular/core';
import { CardOperacionesComponent } from '../card-operaciones/card-operaciones.component';
import { BotonsComponent } from "../botons/botons.component";
import { TablaComponent } from "../tabla/tabla.component";
import { MenuAccionesComponent } from "../menuAcciones/menuAcciones.component";


@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CardOperacionesComponent, BotonsComponent, TablaComponent, MenuAccionesComponent],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalSostenimientoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
