import { Component } from '@angular/core';
import { Environment } from '../../environments/environment';
import { CreateKpisService } from '../../services/CreateKpis/create-kpis.service';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kpis-add',
  templateUrl: './kpis-add.component.html',
  styleUrl: './kpis-add.component.css'
})
export class KpisAddComponent {

  kpiName: string = '';
  kpiType: string = '';
  kpiDescription: string = '';
  projectCreationSuccess: boolean = false;
  projectCreationError: boolean = false;

  constructor(private createKpisService: CreateKpisService, private authServiceToken: AuthServiceTokenService, private authService: MsalService, private router:Router) { }

  getAccountName(): any {
    let name = this.authService.instance.getActiveAccount()?.name;
    return name;
  }

  createKpi(): void {
    const kpiData = {
      name: this.kpiName,
      type_kp: this.kpiType,
      importance: this.kpiDescription,
      project_idproject: Environment.projectId, // Obtener el rol del usuario
      project_person_idactive: this.authServiceToken.getAccessIdactive()
    };

    this.createKpisService.createKpi(kpiData).subscribe(
      response => {
        console.log('KPI created successfully:', response);
        this.projectCreationSuccess = true;
        this.projectCreationError = false;
        // Aquí puedes redirigir a una página de éxito o realizar otra acción necesaria
        setTimeout(() => {
          this.router.navigate(['/dbkpis']);
        }, 2000);
      },
      error => {
        console.error('Error creating KPI:', error);
        this.projectCreationSuccess = false;
        this.projectCreationError = true;
        // Aquí puedes mostrar un mensaje de error al usuario o realizar otra acción necesaria
        setTimeout(() => {
          this.projectCreationError = false;
        }, 2000);
      }
    );
  }

  cancel(): void {
    // Lógica para cancelar la creación del KPI, si es necesario
  }

}
