import { Component } from '@angular/core';
import { CreatenewProjectService } from '../../services/CreateProject/createnew-project.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MsalService } from '@azure/msal-angular';

/* search */
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css'
})
export class ProjectCreateComponent {

  name_user = this.getAccountName()?.toString();

  getAccountName() {
    let name = this.authService.instance.getActiveAccount()?.name;
    return name
  }

  projectData: any = {
    project_name: '',
    description: '',
    start_date: '',
    status_project: 'CREATED',
    person_full_name: this.name_user
  };

  projectCreationSuccess: boolean = false;
  projectCreationError: boolean = false;

  constructor(private projectService: CreatenewProjectService, private authService: MsalService, private router:Router, private authServiceTokenService: AuthServiceTokenService) {
  }

  createProject(): void {
    this.projectService.createProject(this.projectData)
      .subscribe({
        next: response => {
          console.log(response); // Manejar la respuesta del servidor
          // Marcar la creación del proyecto como exitosa
          this.projectCreationSuccess = true;
          this.projectCreationError = false;
          // Iniciar temporizador para redirigir después de 3 segundos (ajusta el tiempo según sea necesario)
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        },
        error: error => {
          console.error('Error al crear proyecto:', error); // Manejar el error
          // Marcar la creación del proyecto como fallida
          this.projectCreationSuccess = false;
          this.projectCreationError = true;
          setTimeout(() => {
            this.projectCreationError = false;
          }, 2000);
        }
      });
  }

}
