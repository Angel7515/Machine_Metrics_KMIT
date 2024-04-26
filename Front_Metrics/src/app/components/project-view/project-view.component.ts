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
  }


  graphics(kpiDataArray: any[], kpiStrPorcentAverage: number) {
    this.fillProgressBar();
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
    }, 70);
  } */

  loadKpiPerformance() {
    this.kpiPerformanceDB.getKpisByProject(parseInt(this.projectID)).subscribe(
      (data: any[]) => {
        this.kpiPerformance = data;
        let totalKPIsWithPerformance = 0; // Contador de KPIs con registros de rendimiento
        let kpiStrPorcentSum = 0; // Suma de valores kpi_str_porcent

        // Iterar sobre las KPIs para calcular la suma de los valores kpi_str_porcent
        this.kpiPerformance.forEach(kpi => {
          if (kpi.kpi_str_porcent !== null) { // Solo sumar si el valor no es nulo
            kpiStrPorcentSum += parseFloat(kpi.kpi_str_porcent);
            totalKPIsWithPerformance++; // Incrementar el contador de KPIs con registros de rendimiento
          }
          if (kpi.date_upload !== null) { // Verificar si date_upload no es nulo
            kpi.date_upload = kpi.date_upload.substring(0, 10);
          }
        });

        // Calcular el promedio solo si hay KPIs con registros de rendimiento
        if (totalKPIsWithPerformance > 0) {
          this.kpiStrPorcentAverage = kpiStrPorcentSum / totalKPIsWithPerformance;
        } else {
          this.kpiStrPorcentAverage = 0; // Establecer en 0 si no hay KPIs con registros de rendimiento
        }

        this.graphics(this.kpiStrPorcentAverage);
      },
      error => {
        console.log('Error al obtener los KPIs de rendimiento:', error);
      }
    );
  }


  graphics(kpiStrPorcentAverage: number) {
    this.fillProgressBar(kpiStrPorcentAverage);
  }

  fillProgressBar(kpiStrPorcentAverage: number): void {
    const progressBar = this.progressBar.nativeElement;

    // Establecer el valor de la barra de progreso
    progressBar.style.width = kpiStrPorcentAverage + '%';
    progressBar.innerText = kpiStrPorcentAverage + '%';
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
