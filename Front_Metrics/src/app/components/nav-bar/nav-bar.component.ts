import { Component } from '@angular/core';

import { AppComponent } from '../../app.component';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent extends AppComponent{

  isAdminRole(): boolean {
    // Obtener el rol del localStorage y comprobar si es 'admin'
    const role = this.authServiceToken.getAccessRole();
    if(role==='ADMIN'){
      return false
    }else{
      return true;
    }
  }


}
