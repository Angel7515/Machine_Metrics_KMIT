import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';


import { ActivatedRoute } from '@angular/router';
import { IDprojectService } from '../../services/IDprojectService/idproject.service';
import { Environment } from '../../environments/environment';
import { SearchOnePersonService } from '../../services/SearchOnePerson/search-one-person.service';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';

import { UsersService } from '../../services/AllUsers/users.service';

import { GetParticipantsAllService } from '../../services/GetPersonProject/get-participants-all.service';

import { KpiPerformanceService } from '../../services/OverviewKPIPerformance/kpi-performance.service';



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
    private kpiPerformanceDB: KpiPerformanceService
  ) { }

  ngOnInit() {
    this.projectID = Environment.getProjectId();
    this.loadProjectData();

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

  /*original */
  /* loadKpiPerformance() {
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
  } */

  loadKpiPerformance() {
    this.kpiPerformanceDB.getKpisByProject(parseInt(this.projectID)).subscribe(
      (data: any[]) => {
        this.kpiPerformance = data;
        let totalKPIs = this.kpiPerformance.length;
        let kpiDataArray: any[] = [];
        this.kpiStrPorcentSum = 0; // Reinicializar la suma antes de calcular el promedio
        this.kpiPerformance.forEach(kpi => {
          kpi.date_upload = kpi.date_upload.substring(0, 10);
          this.kpiStrPorcentSum += parseFloat(kpi.kpi_str_porcent);
          kpiDataArray.push({ name: kpi.name, kpi_str_porcent: kpi.kpi_str_porcent });
        });
        if (totalKPIs > 0) {
          this.kpiStrPorcentAverage = this.kpiStrPorcentSum / totalKPIs;
        }
        // Llamar a graphics() dentro del bloque subscribe
        this.graphics(kpiDataArray, this.kpiStrPorcentAverage);
      },
      error => {
        console.log('Error al obtener los KPIs de rendimiento:', error);
      }
    );
  }


  graphics(kpiDataArray: any[], kpiStrPorcentAverage: number) {
    this.fillProgressBar();
    // Actualiza el valor de la barra de progreso
    const progressBar = document.getElementById('progress-bar') as HTMLElement;
    if (progressBar) {
      progressBar.style.width = kpiStrPorcentAverage + '%';
      progressBar.innerText = kpiStrPorcentAverage + '%';
    }
  }

  fillProgressBar(): void {
    const progressBar = this.progressBar.nativeElement;
    let width = 0;
    const interval = setInterval(() => {
      if (width >= this.kpiStrPorcentAverage) {
        clearInterval(interval);
      } else {
        width++;
        progressBar.style.width = width + '%';
        progressBar.innerText = width + '%';
      }
    }, 70); // Este intervalo determina la velocidad de llenado de la barra de progreso
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

  getUserName(personId: string): string {
    const user = this.usuariosDB.find(user => user.idactive === personId);
    return user ? user.full_name : '';
  }

}
