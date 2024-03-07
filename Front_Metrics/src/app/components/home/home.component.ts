import { Component } from '@angular/core';

import { MSAL_INSTANCE, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication } from '@azure/msal-browser';
import { Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';
import { ProjectViewComponent } from '../project-view/project-view.component';
import { Environment } from '../../environments/environment';
import { UsersService } from '../../services/AllUsers/users.service';
import { OverviewProjectsService } from '../../services/OverviewProjects/overview-projects.service';
import { KpiPerformanceService } from '../../services/OverviewKPIPerformance/kpi-performance.service';
import { AllProjectsServiceService } from '../../services/AllProjectsDB/all-projects-service.service';

/* filter */

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
  users: any = [];
  user: any[] = [];

  kpiPerformance: any[] = [];

  projectSummary: any[] = [];

  constructor(
    @Inject(MSAL_INSTANCE) private msalInstance:
      IPublicClientApplication,
    private authService: MsalService,
    public router: Router,
    private authServiceToken: AuthServiceTokenService,
    private projectService: AllProjectsServiceService,
    private userService: UsersService,
    private kpiPerformanceDB: KpiPerformanceService,
    private overviewSummary: OverviewProjectsService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.loadProjectSummary();
    this.setUserRole();
    this.loadKpiPerformance()
    this.getUsers()
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
      return true;
    } else {
      return false;
    }
  }

  loadProjectSummary() {
    this.overviewSummary.getProjectSummary().subscribe(
      (data: any[]) => {
        this.projectSummary = data.map(summary => {
          // Calcular el promedio
          const promedio = summary.total_porcentaje / summary.numero_elementos;

          // Agregar el promedio como una nueva propiedad al objeto summary
          return { ...summary, prom: promedio };
        });
        // Una vez que se ha calculado el promedio, cargar los proyectos
        this.loadProjects(); // Llamar a loadProjects() aquí
      },
      error => {
        console.log('Error al obtener el resumen del proyecto:', error);
      }
    );
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(
      (data: any[]) => {
        // Fusionar los arreglos
        this.filteredProjects = data.map(project => {
          const summary = this.projectSummary.find(summary => summary.project_idproject === project.idproject);
          if (summary) {
            project.total_porcentaje = summary.total_porcentaje;
            project.numero_elementos = summary.numero_elementos;
            project.fecha_ultima_actualizacion = summary.fecha_ultima_actualizacion;
            project.prom = summary.prom;
          }
          // Aplicar la transformación a start_date de cada posición
          if (project.start_date) {
            project.start_date = project.start_date.substring(0, 10);
            if (project.end_date) {
              project.end_date = project.end_date.substring(0, 10);
            }
          }
          return project;
        });

        // Filtrar los usuarios por idactive
        this.userService.getUsers().subscribe((users: any[]) => {
          this.users = users;
          // Agregar el nombre de los usuarios al arreglo filteredProjects si person_idactive coincide con idactive
          this.filteredProjects.forEach(project => {
            const user = this.users.find((user: any) => user.idactive === project.person_idactive);
            if (user) {
              project.person_name = user.full_name;
            }
          });
        });console.log(this.filteredProjects)
        // Aplicar el filtro según el rol de acceso
        if (this.authServiceToken.getAccessRole() !== 'ADMIN') {
          const idactive_responsable = this.authServiceToken.getAccessIdactive();
          this.filteredProjects = this.filteredProjects.filter(project => project.person_idactive === idactive_responsable);
        }
      },
      error => {
        console.log('Error al obtener proyectos:', error);
      }
    );
  }


  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data: any[]) => {
        this.users = data;
      },
      (error) => {
        console.log('Error fetching users:', error);
      }
    );
    this.userService.getUsers().subscribe(users => this.users = users);
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
