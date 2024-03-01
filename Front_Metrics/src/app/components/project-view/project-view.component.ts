import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDprojectService } from '../../services/IDprojectService/idproject.service';
import { Environment } from '../../environments/environment';
import { SearchOnePersonService } from '../../services/SearchOnePerson/search-one-person.service';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';

import { UsersService } from '../../services/AllUsers/users.service';
import { GetPerformanceService } from '../../services/GetPerformance/get-performance.service';
import { GetParticipantsAllService } from '../../services/GetPersonProject/get-participants-all.service';
import { KpisAllService } from '../../services/KpisAll/kpis-all.service';


@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css'
})
export class ProjectViewComponent implements OnInit {
  projectID: string = '';
  projectDetails: any;
  date: any;
  nameperson: string = '';

  usuariosDB: any[] = [];
  participantesDB: any[] = [];
  rendimientosDB: any[] = [];
  categoriaRendimientoDB: any[] = [];

  filteredParticipants: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private projectService: IDprojectService,
    private searchperson: SearchOnePersonService,
    private authServiceToken: AuthServiceTokenService,
    private userAllDB: UsersService,
    private participantsDB: GetParticipantsAllService,
    private performanceDB: GetPerformanceService,
    private kpiDB: KpisAllService
  ) { }

  ngOnInit() {
    this.projectID = Environment.getProjectId();
    this.loadProjectData();
  }

  loadProjectData() {
    this.loadProjectDetails(this.projectID);
    this.loadUsuarios();
    this.loadParticipantes();
    this.loadRendimientos();
    this.loadCategoriaRendimiento();

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

  loadUsuarios() {
    this.userAllDB.getUsers().subscribe(
      (data: any[]) => {
        this.usuariosDB = data;
      },
      error => {
        console.log('Error al obtener los usuarios:', error);
      }
    );
  }

  loadParticipantes() {
    this.participantsDB.getAllPersonProjects().subscribe(
      (data: any[]) => {
        this.participantesDB = data;
        this.filterParticipants();
      },
      error => {
        console.log('Error al obtener los participantes:', error);
      }
    );
  }

  loadRendimientos() {
    this.performanceDB.getAllPerformances().subscribe(
      (data: any[]) => {
        this.rendimientosDB = data;
      },
      error => {
        console.log('Error al obtener los rendimientos:', error);
      }
    );
  }

  loadCategoriaRendimiento() {
    this.kpiDB.getAllKPIs().subscribe(
      (data: any[]) => {
        this.categoriaRendimientoDB = data;
      },
      error => {
        console.log('Error al obtener la categoría de rendimiento:', error);
      }
    );
  }

  isAdminRole(): boolean {
    if (this.authServiceToken.getAccessRole() === 'ADMIN') {
      return true
    } else {
      return false
    }
  }

  /* Filtrar usuarios por proyecto y registro diccionario */
  filterParticipants() {
    this.filteredParticipants = this.participantesDB.filter(participant => {
      return participant.project_idproject === this.projectID;
    });
  }

  getUserName(personId: string): string {
    const user = this.usuariosDB.find(user => user.idactive === personId);
    return user ? user.full_name : '';
  }

}
