import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* rutas */
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectViewComponent } from './components/project-view/project-view.component';
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { UserComponent } from './components/user/user.component';
import { KpisComponent } from './components/kpis/kpis.component';
import { KpisViewComponent } from './components/kpis-view/kpis-view.component';
import { KpisAddComponent } from './components/kpis-add/kpis-add.component';
import { KpisPerformanceComponent } from './components/kpis-performance/kpis-performance.component';
import { NewPerformanceComponent } from './components/new-performance/new-performance.component';
import { KpiEditComponent } from './components/kpi-edit/kpi-edit.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent},
  {path:'access-denied',component:AccessDeniedComponent},
  {path:'project',component:ProjectCreateComponent},
  {path:'projectview/:idproject',component:ProjectViewComponent},
  {path:'dbeditproject/:idproject',component:ProjectEditComponent},
  {path:'dbusers',component:UserComponent},
  {path:'dbkpis',component:KpisComponent},
  {path:'kpisview/:idproject',component:KpisViewComponent},
  {path:'kpiAdd',component:KpisAddComponent},
  {path:'performance/:id',component:KpisPerformanceComponent},
  {path:'newperformance',component:NewPerformanceComponent},
  {path:'editkpi/:id',component:KpiEditComponent},
  {path:'**',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
