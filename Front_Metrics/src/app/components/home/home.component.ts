import { Component } from '@angular/core';

import { MSAL_INSTANCE,MsalService } from '@azure/msal-angular';
import { IPublicClientApplication } from '@azure/msal-browser';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceTokenService } from '../../services/auth-service-token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  accessToken: string='';

  constructor(@Inject(MSAL_INSTANCE) private msalInstance: IPublicClientApplication, private authService: MsalService, public router: Router, private authServiceToken:AuthServiceTokenService) { }

  ngOnInit(): void {
    this.accessToken = this.authServiceToken.getAccessToken();
    console.log(this.accessToken)
  }
  
  getAccountName() {
    let name = this.authService.instance.getActiveAccount()?.name;
    return name
  }
}
