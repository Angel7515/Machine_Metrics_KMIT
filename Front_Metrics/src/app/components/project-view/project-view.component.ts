import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDprojectService } from '../../services/IDprojectService/idproject.service';
import { Environment } from '../../environments/environment';
import { SearchOnePersonService } from '../../services/SearchOnePerson/search-one-person.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css'
})
export class ProjectViewComponent implements OnInit {
  projectID: string = '';
  projectDetails: any;
  date: any;
  nameperson:string = '';

  constructor(private route: ActivatedRoute, private projectService: IDprojectService, private searchperson:SearchOnePersonService) { }

  ngOnInit() {
    this.projectID = Environment.getProjectId();
    this.loadProjectDetails(this.projectID);
  }

  loadProjectDetails(projectID: string) {
    this.projectService.getProjectById(projectID).subscribe(
      (data: any) => {
        this.projectDetails = data;
        this.projectDetails[0].start_date = this.projectDetails[0].start_date.substring(0, 10);
        this.searchperson.getPersonNameByIdActive(this.projectDetails[0].person_idactive)
          .subscribe(
            (person: any) => {
              this.nameperson = person.fullName;
              console.log(this.nameperson);
            },
            error => {
              console.log('Error al obtener el nombre de la persona:', error);
            }
          );
      },
      error => {
        console.log('Error al obtener los detalles del proyecto:', error);
      }
    );
  }
}
