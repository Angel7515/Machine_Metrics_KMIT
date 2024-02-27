import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.css'
})
export class AccessDeniedComponent extends AppComponent{

  userData : any;

  getUserData() {
    // Obtenemos el token de acceso del usuario autenticado
    const accessToken = this.authServiceToken.getAccessToken();

    if (accessToken) {
      // Creamos los encabezados con el token de acceso
      const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);

      // Hacemos una solicitud GET a la API de Microsoft Graph para obtener los datos del usuario
      this.http.get<any>('https://graph.microsoft.com/v1.0/me', { headers })
        .subscribe(
          (response) => {
            // Asignamos los datos del usuario a la variable userData
            this.userData = response.displayName;
            console.log('Datos del usuario:', this.userData);
          },
          (error) => {
            console.error('Error al obtener datos del usuario:', error);
          }
        );
    } else {
      console.error('No se pudo obtener el token de acceso.');
    }
  }

}
