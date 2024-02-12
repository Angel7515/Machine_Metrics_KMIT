import { Component } from '@angular/core';

import { MSAL_INSTANCE,MsalService } from '@azure/msal-angular';
import { IPublicClientApplication } from '@azure/msal-browser';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(@Inject(MSAL_INSTANCE) private msalInstance: IPublicClientApplication, private authService: MsalService, public router: Router) { }

  
  getAccountName() {
    let name = this.authService.instance.getActiveAccount()?.name;
    return name
  }
}
