import { Component } from '@angular/core';

import { MSAL_INSTANCE, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication } from '@azure/msal-browser';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';
import { ProjectViewComponent } from '../project-view/project-view.component';
import { Environment } from '../../environments/environment';

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
  searchTerm: string = '';
  date: any;
  endate: any;

  constructor(@Inject(MSAL_INSTANCE) private msalInstance: IPublicClientApplication, private authService: MsalService, public router: Router, private authServiceToken: AuthServiceTokenService, private projectService: AllProjectsServiceService) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  getAccountName() {
    let name = this.authService.instance.getActiveAccount()?.name;
    return name
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(
      (data: any[]) => {
        this.projects = data;
        this.date = this.projects[0].start_date;
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

}
