import { Component } from '@angular/core';
import { PrincipalGraficoScoopsComponent } from '../../../../Components/Dashboard/graficos/scoops/principal-grafico-scoops/principal-grafico-scoops.component';

@Component({
  selector: 'app-dashboard-carguio-page',
  standalone: true,
  imports: [PrincipalGraficoScoopsComponent],
  templateUrl: './dashboard-carguio-page.component.html',
})
export class DashboardCarguioPageComponent {}
