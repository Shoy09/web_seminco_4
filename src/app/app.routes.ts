import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Principales/login/login.component';
import { HomeComponent } from './Components/Principales/home/home.component';
import { EstadosComponent } from './Components/Estado/estados/estados.component';
import { UsuariosComponent } from './Components/Usuario/usuarios/usuarios.component';
import { CrearDataComponent } from './Components/Crear datos/crear-data/crear-data.component';
import { UsuarioComponent } from './Components/Usuario/usuario/usuario.component';
import { AutocadMineroComponent } from './Components/autocad-minero/autocad-minero.component';
import { CheckListListaComponent } from './Components/Crear datos/check list/check-list-lista/check-list-lista.component';
import { ChecklistTelemandoListaComponent } from './Components/Crear datos/check List Carguip/checklist-telemando-lista/checklist-telemando-lista.component';
import { PowerBiPublicComponent } from './Components/Dashboard/Pu-PowerBi/power-bi-public/power-bi-public.component';
import { ExplosivosComponent } from './Components/Crear datos/explosivos/explosivos.component';
import { ExplosivosGraficosComponent } from './Components/Dashboard/Explosivos/explosivos-graficos/explosivos-graficos.component';
import { DashboardPruebaComponent } from './Components/Dashboard/sostenimiento/dashboard-prueba/dashboard-prueba.component';
import { PrincipalGraficoSostenimientoComponent } from './Components/Dashboard/graficos/sostenimiento/principal-grafico-sostenimiento/principal-grafico-sostenimiento.component';
import { LayoutComponent } from './Components/Principales/layout/layout.component';
import { DashboardCarguioPageComponent } from './features/dashboard/pages/dashboard-carguio/dashboard-carguio-page.component';
import { DashboardLineaTiempoPageComponent } from './features/dashboard/pages/dashboard-linea-tiempo/dashboard-linea-tiempo-page.component';
import { DashboardTalHorizontalPageComponent } from './features/dashboard/pages/dashboard-tal-horizontal/dashboard-tal-horizontal-page.component';
import { DashboardTalLargoPageComponent } from './features/dashboard/pages/dashboard-tal-largo/dashboard-tal-largo-page.component';
import { MonitoreoScoopsComponent } from './features/monitoreo-mina/pages/monitoreo-scoops/monitoreo-scoops.component';
import { MonitoreoPerfHorizontalComponent } from './features/monitoreo-mina/pages/monitoreo-perf-horizontal/monitoreo-perf-horizontal.component';
import { SeleccionEquipoPageComponent } from './features/validaciones/pages/seleccion-equipo/seleccion-equipo-page.component';
import { MonitoreoValidacionesPageComponent } from './features/validaciones/pages/monitoreo-validaciones/monitoreo-validaciones-page.component';
import { DetalleValidacionPageComponent } from './features/validaciones/pages/detalle-validacion/detalle-validacion-page.component';
import { ProcesosPageComponent } from './features/sistema/pages/procesos-page/procesos-page.component';
import { TipoPerforacionesPageComponent } from './features/sistema/pages/tipo-perforaciones-page/tipo-perforaciones-page.component';
import { EquiposPageComponent } from './features/sistema/pages/equipos-page/equipos-page.component';
import { LaboresPageComponent } from './features/sistema/pages/labores-page/labores-page.component';
import { PeriodosPageComponent } from './features/sistema/pages/periodos-page/periodos-page.component';
import { TurnosPageComponent } from './features/sistema/pages/turnos-page/turnos-page.component';
import { PlanMetrajeTlPageComponent } from './features/planes/pages/plan-metraje-tl-page/plan-metraje-tl-page.component';
import { PlanAvanceThPageComponent } from './features/planes/pages/plan-avance-th-page/plan-avance-th-page.component';
import { PlanProduccionPageComponent } from './features/planes/pages/plan-produccion-page/plan-produccion-page.component';
import { ChecklistCategoriasPageComponent } from './features/sistema/pages/checklist-categorias-page/checklist-categorias-page.component';
import { TiposHorometrosPageComponent } from './features/sistema/pages/tipos-horometros-page/tipos-horometros-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent, // Layout principal con menú
    children: [
      {
        path: 'monitoreo',
        children: [
          { path: 'scoops', component: MonitoreoScoopsComponent },
          { path: 'jumbos', component: MonitoreoPerfHorizontalComponent },
          /* { path: 'general', component: MonitoreoGeneralComponent }, */
          /* 
          
          { path: 'volquetes', component: MonitoreoVolquetesComponent },
          { path: 'linea-tiempo', component: LineaTiempoComponent },
          { path: 'alertas', component: AlertasOperativasComponent }, */
        ],
      },
      {
        path: 'dashboard',
        children: [
          {
            path: 'grafico-horizontal',
            component: DashboardTalHorizontalPageComponent,
          },
          {
            path: 'grafico-tal-largo',
            component: DashboardTalLargoPageComponent,
          },
          {
            path: 'grafico-sostenimiento',
            component: PrincipalGraficoSostenimientoComponent,
          },
          {
            path: 'grafico-scoops',
            component: DashboardCarguioPageComponent,
          },
          /* {
            path: 'grafico-acarreo',
            component: PrincipalGraficoAcarreoComponent,
          }, */

          { path: 'linea-de-tiempo', component: DashboardLineaTiempoPageComponent },
        ],
      },
      {
        path: 'validaciones',
        children: [
          { path: 'jefe-mina', component: SeleccionEquipoPageComponent },
          {
            path: 'jefe-mina/:equipo/operacion/:id',
            component: DetalleValidacionPageComponent,
          },
          { path: 'jefe-mina/:equipo', component: MonitoreoValidacionesPageComponent },

          { path: 'power-bi', component: PowerBiPublicComponent },
        ],
      },
      {
        path: 'planes',
        children: [
          { path: 'plan-avance-th', component: PlanAvanceThPageComponent },
          { path: 'plan-metraje-tl', component: PlanMetrajeTlPageComponent },
          { path: 'plan-produccion', component: PlanProduccionPageComponent },
        ],
      },
      {
        path: 'carga',
        children: [
          { path: 'tipo-horometros', component: TiposHorometrosPageComponent },
          { path: 'equipos', component: EquiposPageComponent },
          { path: 'labores', component: LaboresPageComponent },
          { path: 'periodos', component: PeriodosPageComponent },
          { path: 'procesos', component: ProcesosPageComponent },
          { path: 'turnos', component: TurnosPageComponent },
          { path: 'tipo-perforaciones', component: TipoPerforacionesPageComponent },
          { path: 'estados', component: EstadosComponent },
          { path: 'crear-data', component: CrearDataComponent },
          { path: 'checklist-categorias', component: ChecklistCategoriasPageComponent },
          { path: 'checklist', component: CheckListListaComponent },
          {
            path: 'checklist-telemando',
            component: ChecklistTelemandoListaComponent,
          },
          { path: 'explosivos', component: ExplosivosComponent },
          {
            path: 'explosivos-graficos',
            component: ExplosivosGraficosComponent,
          },
        ],
      },
      {
        path: 'roles',
        children: [{ path: 'usuarios', component: UsuariosComponent }],
      },
      { path: 'perfil', component: UsuarioComponent },
    ],
  },

  { path: '**', redirectTo: '/login' },
];
