import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Principales/login/login.component';
import { PrincipalComponent } from './Components/Principales/principal/principal.component';
import { HomeComponent } from './Components/Principales/home/home.component';
import { EstadosComponent } from './Components/Estado/estados/estados.component';
import { UsuariosComponent } from './Components/Usuario/usuarios/usuarios.component';
import { CrearDataComponent } from './Components/Crear datos/crear-data/crear-data.component';
import { PlanMensualListComponent } from './Components/Planes mensuales/Plan mensual avance/plan-mensual-list/plan-mensual-list.component';
import { PlanMetrajeListComponent } from './Components/Planes mensuales/Plan mensual metraje/plan-metraje-list/plan-metraje-list.component';
import { PlanProduccionListComponent } from './Components/Planes mensuales/Plan mensual produccion/plan-produccion-list/plan-produccion-list.component';
import { UsuarioComponent } from './Components/Usuario/usuario/usuario.component';
import { AutocadMineroComponent } from './Components/autocad-minero/autocad-minero.component';
import { CheckListListaComponent } from './Components/Crear datos/check list/check-list-lista/check-list-lista.component';




export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'Dashboard',
    component: PrincipalComponent, // Layout principal con menú
    children: [
      { path: 'estados', component: EstadosComponent },
      { path: 'crear-data', component: CrearDataComponent },
      { path: 'plan-avance', component: PlanMensualListComponent },
      { path: 'plan-metraje', component: PlanMetrajeListComponent },
      { path: 'plan-produccion', component: PlanProduccionListComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'perfil', component: UsuarioComponent },
      { path: 'autocad', component: AutocadMineroComponent },
      { path: 'checklist', component: CheckListListaComponent },

    ]
  },

  { path: '**', redirectTo: '/login' },
];
