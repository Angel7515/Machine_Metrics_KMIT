import { Component, OnInit } from '@angular/core';

/* MSAL SERVICE */
import { CommonModule } from '@angular/common';
import { MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { Environment } from './environments/environment';
import { RouterModule, Router } from '@angular/router';
import { Inject } from '@angular/core';
import { AuthServiceTokenService } from './services/AuthServiceToken/auth-service-token.service';


import { CheckUserService } from './services/CheckUsers/check-user.service';

export function MSSALInstanceFactory(): IPublicClientApplication {

  const pca = new PublicClientApplication({
    auth: {
      clientId: Environment.CLIENT_ID,
      redirectUri: Environment.REDIRECT_URI,
      authority: Environment.AUTHORITY,
    }
  });
  pca.initialize();
  return pca;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [{
    provide: MSAL_INSTANCE,
    useFactory: MSSALInstanceFactory
  },
    MsalService
  ]
})
export class AppComponent implements OnInit {
  title = 'Front_Metrics';
  showNavigationBar: boolean = true;

  async ngOnInit() {
    await this.msalInstance.initialize();
    this.handleRedirect();
  }
  
  public handleRedirect() {
    this.msalInstance.handleRedirectPromise().then(() => {
      if (this.authService.instance.getAllAccounts().length > 0) {
        const username: any = this.getAccountName();
        this.checkUserService.checkUserAccess(username).subscribe(
          (response) => {
            if (response.accessGranted) {
              this.router.navigate(['home']);
            } else {
              // Redirigir al componente de acceso denegado
              this.router.navigate(['access-denied']);
            }
          },
          (error) => {
            if (error.accessGranted === false) {
              // Acceso denegado
              this.router.navigate(['access-denied']);
            } else {
              console.error('Error:', error);
              // Manejar otros errores según corresponda
            }
          }
        );
      } else {
        this.router.navigate(['login']);
      }
    });
  }



  constructor(
    @Inject(MSAL_INSTANCE) private msalInstance: IPublicClientApplication,
    private authService: MsalService,
    public router: Router,
    public authServiceToken: AuthServiceTokenService,
    private checkUserService: CheckUserService
  ) { }

  // Login
  login() {
    this.authService.loginPopup().subscribe((response: AuthenticationResult) => {
      const accessToken = response.accessToken;
      this.authServiceToken.setAccessToken(accessToken);
      this.authService.instance.setActiveAccount(response.account);
    });
  }

  // Logout
  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  // Is authenticated
  isAuthenticated() {
    return this.authService.instance.getActiveAccount() !== null;
  }

  // Is authenticated
  getAccountName() {
    return this.authService.instance.getActiveAccount()?.name;
  }

}
