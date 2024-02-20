import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDprojectService } from '../../services/IDprojectService/idproject.service';
import { Environment } from '../../environments/environment';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css'
})
export class ProjectViewComponent implements OnInit {
  projectID: string = '';
  projectDetails: any;
  date: any;

  constructor(private route: ActivatedRoute, private projectService: IDprojectService) { }

  ngOnInit() {
    this.projectID = Environment.getProjectId();
    this.loadProjectDetails(this.projectID);
  }

  loadProjectDetails(projectID: string) {
    this.projectService.getProjectById(projectID).subscribe(
      (data: any) => {
        this.projectDetails = data;
        this.projectDetails[0].start_date = this.projectDetails[0].start_date.substring(0, 10);
        console.log(this.projectDetails[0].start_date);
      },
      error => {
        console.log('Error al obtener los detalles del proyecto:', error);
      }
    );
  }
}
