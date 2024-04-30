import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

/* MSAL CONFIGURATION */
import { MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { RouterModule } from '@angular/router';
import { Environment } from './environments/environment';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectViewComponent } from './components/project-view/project-view.component';

import { HttpClientModule } from '@angular/common/http';

/* filter */
import { FilterPipe } from './components/filter.pipe';
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { UserComponent } from './components/user/user.component';
import { KpisComponent } from './components/kpis/kpis.component';
import { KpisViewComponent } from './components/kpis-view/kpis-view.component';
import { KpisPerformanceComponent } from './components/kpis-performance/kpis-performance.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { KpisAddComponent } from './components/kpis-add/kpis-add.component';
import { NewPerformanceComponent } from './components/new-performance/new-performance.component';
import { KpiEditComponent } from './components/kpi-edit/kpi-edit.component';


export function MSSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth:{
      clientId: Environment.CLIENT_ID,
      redirectUri: Environment.REDIRECT_URI
    }
  })
}

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    NavBarComponent,
    AppComponent,
    ProjectCreateComponent,
    ProjectViewComponent,
    FilterPipe,
    ProjectEditComponent,
    UserComponent,
    KpisComponent,
    KpisViewComponent,
    KpisPerformanceComponent,
    AccessDeniedComponent,
    KpisAddComponent,
    NewPerformanceComponent,
    KpiEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSSALInstanceFactory
    },
    MsalService,
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry) {
    // Registrar los íconos de Material Design
    matIconRegistry.registerFontClassAlias('material-icons', 'material-icons');
  }
 }
