import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Environment } from '../../environments/environment';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';
import { MsalService } from '@azure/msal-angular';

import { AllProjectsServiceService } from '../../services/AllProjectsDB/all-projects-service.service';
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-kpis',
  templateUrl: './kpis.component.html',
  styleUrls: ['./kpis.component.css']
})
export class KpisComponent {

  projects: any[] = [];
  filteredProjects: any[] = [];
  searchTerm: string = '';

  constructor(
    private projectService: AllProjectsServiceService,
    public router: Router,
    private authServiceToken: AuthServiceTokenService,
    private authservice: MsalService
  ) { }

  getAccountName(): any {
    let name = this.authservice.instance.getActiveAccount()?.name;
    return name;
  }

  isAdminRole(): boolean {
    // Obtener el rol del localStorage y comprobar si es 'admin'
    const role = this.authServiceToken.getAccessRole();
    if (role === 'ADMIN') {
      return true
    } else {
      return false;
    }
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(
      (data: any[]) => {
        this.filteredProjects = data;
        if (this.authServiceToken.getAccessRole() == 'ADMIN') {
          console.log('ADMIN')
          // Si es administrador, muestra todos los proyectos
          this.projects = data.map(project => {
            // Aplicar la transformación a start_date de cada posición
            if (project.start_date) {
              project.start_date = project.start_date.substring(0, 10);
              if (project.end_date) {
                project.end_date = project.end_date.substring(0, 10);
              }
            }
            return project;
          });
        } else {
          console.log('LEADER')
          // Si no es administrador, filtra los proyectos por el nombre del líder
          const idactive_responsable = this.authServiceToken.getAccessIdactive();
          this.filteredProjects = data.filter(project => project.person_idactive === idactive_responsable)
            .map(project => {
              console.log(project.length)
              if (project.start_date) {
                project.start_date = project.start_date.substring(0, 10);
                if (project.end_date) {
                  project.end_date = project.end_date.substring(0, 10);
                }
              }
              return project;
            });

        }
      },
      error => {
        console.log('Error al obtener proyectos:', error);
      }
    );
  }

  navigateToKpisView(projectId: string, projectName: string) {
    this.router.navigate(['/kpisview', projectId, { projectName: projectName }]);
    Environment.setProjectId(projectId);
    Environment.setusername(projectName)
  }

}
