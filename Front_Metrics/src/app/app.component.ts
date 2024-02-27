import { Component, OnInit } from '@angular/core';

/* MSAL SERVICE */
import { CommonModule } from '@angular/common';
import { MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { Environment } from './environments/environment';
import { RouterModule, Router } from '@angular/router';
import { Inject } from '@angular/core';
import { AuthServiceTokenService } from './services/AuthServiceToken/auth-service-token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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
  userNameMsal: any;
  userIDData: any;


  async ngOnInit() {
    await this.msalInstance.initialize();
    this.handleRedirect();
  }

  public handleRedirect() {
    this.msalInstance.handleRedirectPromise().then(() => {
      if (this.isAuthenticated()) {
        const accessToken = this.authServiceToken.getAccessToken();

        if (accessToken) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);

          this.http.get<any>('https://graph.microsoft.com/v1.0/me', { headers }).subscribe(
            (response) => {
              this.authServiceToken.setAccessIdactive(response.id);//guardar el id de usuario en variable local del navegador
              this.checkUserService.checkUserAccess(response.id, response.displayName).subscribe(
                (accessResponse) => {
                  if (accessResponse.accessGranted) {
                    this.router.navigate(['home']);
                  } else {
                    this.router.navigate(['access-denied']);
                  }
                },
                (error) => {
                  console.error('Error al validar acceso del usuario:', error);
                  this.router.navigate(['access-denied']);
                }
              );
            },
            (error) => {
              console.error('Error al obtener datos del usuario:', error);
              this.router.navigate(['access-denied']);
            }
          );
        } else {
          console.error('No se pudo obtener el token de acceso del usuario.');
          this.router.navigate(['access-denied']);
        }
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
    private checkUserService: CheckUserService,
    public http: HttpClient
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