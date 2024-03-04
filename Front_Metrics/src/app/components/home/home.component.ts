import { Component } from '@angular/core';

import { MSAL_INSTANCE, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication } from '@azure/msal-browser';
import { Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';
import { ProjectViewComponent } from '../project-view/project-view.component';
import { Environment } from '../../environments/environment';
import { UsersService } from '../../services/AllUsers/users.service';

import { KpiPerformanceService } from '../../services/OverviewKPIPerformance/kpi-performance.service';

import { AllProjectsServiceService } from '../../services/AllProjectsDB/all-projects-service.service';

/* filter */
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  accessToken: string = '';
  projects: any[] = [];
  filteredProjects: any[] = [];
  searchTerm: string = '';
  endate: any;
  projectID: string = '';
  projectDetails: any;

  kpiPerformance: any[] = [];

  constructor(
    @Inject(MSAL_INSTANCE) private msalInstance:
      IPublicClientApplication,
    private authService: MsalService,
    public router: Router,
    private authServiceToken: AuthServiceTokenService,
    private projectService: AllProjectsServiceService,
    private userService: UsersService,
    private kpiPerformanceDB: KpiPerformanceService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.setUserRole();
    this.loadKpiPerformance()
  }

  getAccessRole(): string {
    return this.authServiceToken.getAccessRole();
  }

  getAccountName(): any {
    let name = this.authService.instance.getActiveAccount()?.name;
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
          // Si no es administrador, filtra los proyectos por el nombre del líder
          const idactive_responsable = this.authServiceToken.getAccessIdactive();
          this.filteredProjects = data.filter(project => project.person_idactive === idactive_responsable)
            .map(project => {
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


  navigateToProjectView(projectId: string) {
    this.router.navigate(['/projectview', projectId]);
    Environment.setProjectId(projectId);
  }

  setUserRole() {
    const accountName = this.getAccountName();
    this.userService.getUsers().subscribe(
      (users: any[]) => {
        const user = users.find(user => user.full_name === accountName);
        if (user) {
          this.authServiceToken.setAccessRole(user.user_role); // Set the role in localStorage
        }
      },
      error => {
        console.log('Error al obtener usuarios:', error);
      }
    );
  }

  // Método para filtrar los proyectos en función de searchTerm
  filterProjects() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // Si searchTerm está vacío, mostrar todos los proyectos
      this.filteredProjects = this.projects;
    } else {
      // Filtrar los proyectos en función de searchTerm y status
      this.filteredProjects = this.projects.filter(project =>
      (project.project_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.status_project.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  /* carga de overview */

  loadKpiPerformance() {
    this.kpiPerformanceDB.getKpisByProject(parseInt(this.projectID)).subscribe(
      (data: any[]) => {
        this.kpiPerformance = data;
        this.kpiPerformance.forEach(kpi => {
          kpi.date_upload = kpi.date_upload.substring(0, 10);
        });
        console.log(this.kpiPerformance)
      },
      error => {
        console.log('Error al obtener los KPIs de rendimiento:', error);
      }
    );
  }


}
