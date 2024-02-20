import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Environment } from '../../environments/environment';

import { AllProjectsServiceService } from '../../services/AllProjectsDB/all-projects-service.service';
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-kpis',
  templateUrl: './kpis.component.html',
  styleUrl: './kpis.component.css'
})
export class KpisComponent {

  projects: any[] = [];
  searchTerm: string = '';

  constructor(private projectService: AllProjectsServiceService, public router: Router){}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(
      (data: any[]) => {
        this.projects = data;
      },
      error => {
        console.log('Error al obtener proyectos:', error);
      }
    );
  }

  navigateToKpisView(projectId: string) {
    this.router.navigate(['/kpisview', projectId]);
    Environment.setProjectId(projectId);
  }

}
