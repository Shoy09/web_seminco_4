import { Component } from '@angular/core';
import { LineaPrincipalComponent } from '../../../../Components/Dashboard/graficos/Linea de tiempo/linea.principal/linea.principal.component';

@Component({
  selector: 'app-dashboard-linea-tiempo-page',
  standalone: true,
  imports: [LineaPrincipalComponent],
  templateUrl: './dashboard-linea-tiempo-page.component.html',
})
export class DashboardLineaTiempoPageComponent {}
