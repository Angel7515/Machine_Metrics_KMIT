import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

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
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideClientHydration(),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSSALInstanceFactory
    },
    MsalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
