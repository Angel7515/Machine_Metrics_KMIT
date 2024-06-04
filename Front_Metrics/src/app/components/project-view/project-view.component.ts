import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { Router } from '@angular/router';


import { ActivatedRoute } from '@angular/router';
import { IDprojectService } from '../../services/IDprojectService/idproject.service';
import { Environment } from '../../environments/environment';
import { SearchOnePersonService } from '../../services/SearchOnePerson/search-one-person.service';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';

import { UsersService } from '../../services/AllUsers/users.service';
import { GetParticipantsAllService } from '../../services/GetPersonProject/get-participants-all.service';
import { KpiPerformanceService } from '../../services/OverviewKPIPerformance/kpi-performance.service';
import { DbKpisPersonService } from '../../services/kpisResponsable/db-kpis-person.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css'
})
export class ProjectViewComponent implements OnInit {
  @ViewChild('progressBar') progressBar!: ElementRef;

  projectID: string = '';
  projectDetails: any;
  date: any;
  nameperson: string = '';

  usuariosDB: any[] = [];
  participantesDB: any[] = [];
  kpiPerformance: any[] = [];
  kpisPersons: any[] = [];
  kpiStrPorcentSum: number = 0;
  kpiStrPorcentAverage: number = 0;
  pieChartData: number[] = [];

  filteredParticipants: any[] = [];

  formattedDescription: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: IDprojectService,
    private searchperson: SearchOnePersonService,
    private authServiceToken: AuthServiceTokenService,
    private userAllDB: UsersService,
    private participantsDB: GetParticipantsAllService,
    private kpiPerformanceDB: KpiPerformanceService,
    private dbKpisPersonService: DbKpisPersonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.projectID = Environment.getProjectId();
    this.loadProjectData();
    this.getKpisPersons();
    this.getKpiPersonsWithUserNames();
  }

  getKpiPersonsWithUserNames(): void {
    this.dbKpisPersonService.getAllKpisPerson().subscribe(
      data => {
        this.kpisPersons = data;
  
        // Creamos un nuevo array para almacenar los datos de asignaciones de personas responsables a KPIs con los nombres de usuario
        const kpiPersonsWithUserNames: any[] = [];
  
        // Iteramos sobre cada registro en kpisPersons
        this.kpisPersons.forEach(kpiPerson => {
          // Obtenemos el nombre del usuario correspondiente al person_idactive
          const userName = this.getUserName(kpiPerson.person_idactive);
          // Creamos un nuevo objeto que contenga los datos de la asignación de persona responsable a KPI, junto con el nombre del usuario
          const kpiPersonWithUserName = {
            kpis_idkpis: kpiPerson.kpis_idkpis,
            kpis_project_idproject: kpiPerson.kpis_project_idproject,
            person_idactive: kpiPerson.person_idactive,
            user_name: userName // Añadimos el nombre del usuario al objeto
          };
          // Agregamos el nuevo objeto al array kpiPersonsWithUserNames
          kpiPersonsWithUserNames.push(kpiPersonWithUserName);
        });
  
        // Ahora kpiPersonsWithUserNames contiene los datos de asignaciones de personas responsables a KPIs con los nombres de usuario
  
        // Asociamos estos datos con los registros de KPIs
        this.kpiPerformance.forEach(kpi => {
          // Filtramos kpiPersonsWithUserNames para encontrar los registros correspondientes al ID del KPI actual
          const matchingRecords = kpiPersonsWithUserNames.filter(record => record.kpis_idkpis === kpi.idkpis);
          // Asignamos los registros correspondientes al KPI actual
          kpi.personsResponsible = matchingRecords;
        });
      },
      error => {
        console.error('Error fetching KPIs Persons:', error);
      }
    );
  }



  getKpisPersons(): void {
    this.dbKpisPersonService.getAllKpisPerson()
      .subscribe(
        data => {
          this.kpisPersons = data;
          /* console.log('KPIs Persons:', this.kpisPersons); */
          // Asociar los IDs de las personas responsables con las KPIs
          this.kpiPerformance.forEach(kpi => {
            const person = this.kpisPersons.find(person => person.kpis_idkpis === kpi.idkpis);
            if (person) {
              kpi.personId = person.person_idactive;
            }
          });
        },
        error => {
          console.error('Error fetching KPIs Persons:', error);
        }
      );
  }

  formatDescription(): void {
    if (this.projectDetails && this.projectDetails.length > 0) {
      this.formattedDescription = this.projectDetails[0].description.replace(/\n/g, '<br>');
    }
  }

  loadProjectData() {
    this.loadProjectDetails(this.projectID);
    this.loadUsuarios();
    this.loadParticipantes();
    this.loadKpiPerformance();
    this.toggleDescription();
  }

  showDescription: boolean = true; // Variable para controlar la visibilidad de la descripción

  toggleDescription(): void {
    this.showDescription = !this.showDescription;
  }

  loadProjectDetails(projectID: string) {
    this.projectService.getProjectById(projectID).subscribe(
      (data: any) => {
        this.projectDetails = data;
        this.projectDetails[0].start_date = this.projectDetails[0].start_date.substring(0, 10);
        this.formatDescription();
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

  loadKpiPerformance() {
    this.kpiPerformanceDB.getKpisByProject(parseInt(this.projectID)).subscribe(
      (data: any[]) => {
        this.kpiPerformance = data;
        let totalKPIs = this.kpiPerformance.length;
        let kpiDataArray: any[] = [];
        this.kpiPerformance.forEach(kpi => {
          kpi.date_upload = kpi.date_upload.substring(0, 10);
          this.kpiStrPorcentSum += parseFloat(kpi.kpi_str_porcent);
          kpiDataArray.push({ name: kpi.name, kpi_str_porcent: kpi.kpi_str_porcent });
        });
        if (totalKPIs > 0) {
          this.kpiStrPorcentAverage = this.kpiStrPorcentSum / totalKPIs;
        }
        this.graphics(kpiDataArray, this.kpiStrPorcentAverage);
      },
      error => {
        console.log('Error al obtener los KPIs de rendimiento:', error);
      }
    );
  }


  graphics(kpiDataArray: any[], kpiStrPorcentAverage: number) {
    this.fillProgressBar();
    const progressBar = document.getElementById('progress-bar') as HTMLElement;
    if (progressBar) {
      progressBar.style.width = kpiStrPorcentAverage.toFixed(1); + '%';
      progressBar.innerText = progressBar.style.width;
    }
  }

  fillProgressBar(): void {
    const progressBar = this.progressBar.nativeElement;
    const targetWidth = this.kpiStrPorcentAverage.toFixed(1);
    progressBar.style.width = targetWidth + '%';
    progressBar.innerText = targetWidth + '%';
  }





  DescriptionTable(kpi: any) {
    kpi.showDescription = !kpi.showDescription;
    // Cambiar el color del texto del enlace en función del estado de showDescription
    const link = document.getElementById('descriptionLink_' + kpi.id) as HTMLSpanElement;
    if (link) {
      link.style.color = kpi.showDescription ? 'blue' : 'red';
    }
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

  /* getUserName(personId: string): string {
    const user = this.usuariosDB.find(user => user.idactive === personId);
    return user ? user.full_name : '';
  } */
  getUserName(personId: string): string {
    const user = this.usuariosDB.find(user => user.idactive === personId);
    return user ? user.full_name : '';
  }

  navigateToKpisView(projectId: string, projectName: string) {
    this.router.navigate(['/kpisview', projectId, { projectName: projectName }]);
    Environment.setProjectId(projectId);
    Environment.setusername(projectName);
  }
  

}
