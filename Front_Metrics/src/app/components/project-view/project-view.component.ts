import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit, AfterViewInit {
  @ViewChild('progressBar') progressBar!: ElementRef;

  projectID: string = '';
  projectDetails: any;
  nameperson: string = '';

  usuariosDB: any[] = [];
  participantesDB: any[] = [];
  kpiPerformance: any[] = [];
  kpisPersons: any[] = [];
  kpiStrPorcentSum: number = 0;
  kpiStrPorcentAverage: number = 0;
  filteredParticipants: any[] = [];
  formattedDescription: string = '';
  showDescription: boolean = true;

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
  }

  /* ngAfterViewInit() {
    this.fillProgressBar();
  } */

  loadProjectData() {
    this.loadProjectDetails(this.projectID);
    this.loadUsuarios();
    this.loadParticipantes();
    this.loadKpiPerformance();
  }

  loadProjectDetails(projectID: string) {
    this.projectService.getProjectById(projectID).subscribe(
      (data: any) => {
        this.projectDetails = data;
        this.projectDetails[0].start_date = this.formatDate(this.projectDetails[0].start_date);
        this.formatDescription();
        this.loadPersonName(this.projectDetails[0].person_idactive);
      },
      error => console.error('Error al obtener los detalles del proyecto:', error)
    );
  }

  loadPersonName(personIdActive: string) {
    this.searchperson.getPersonNameByIdActive(personIdActive).subscribe(
      (person: any) => this.nameperson = person.fullName,
      error => console.error('Error al obtener el nombre de la persona:', error)
    );
  }

  loadUsuarios() {
    this.userAllDB.getUsers().subscribe(
      (data: any[]) => this.usuariosDB = data,
      error => console.error('Error al obtener los usuarios:', error)
    );
  }

  loadParticipantes() {
    this.participantsDB.getAllPersonProjects().subscribe(
      (data: any[]) => {
        this.participantesDB = data;
        this.filterParticipants();
      },
      error => console.error('Error al obtener los participantes:', error)
    );
  }

  loadKpiPerformance() {
    this.kpiPerformanceDB.getKpisByProject(parseInt(this.projectID)).subscribe(
      (data: any[]) => {
        this.kpiPerformance = data.map(kpi => ({
          ...kpi,
          date_upload: this.formatDate(kpi.date_upload),
          start_date: this.formatDate(kpi.start_date),
          end_date: this.formatDate(kpi.end_date)
        }));
        this.calculateKpiStrPorcentAverage();
        this.getKpisPersons();
        this.sortKpiPerformance();  // Ensure sorting is applied after all data is processed
      },
      error => console.error('Error al obtener los KPIs de rendimiento:', error)
    );
  }

  getKpisPersons() {
    this.dbKpisPersonService.getAllKpisPerson().subscribe(
      data => {
        this.kpisPersons = data;
        this.assignPersonsToKpis();
      },
      error => console.error('Error fetching KPIs Persons:', error)
    );
  }

  assignPersonsToKpis() {
    const kpiPersonsWithUserNames = this.kpisPersons.map(kpiPerson => ({
      ...kpiPerson,
      user_name: this.getUserName(kpiPerson.person_idactive)
    }));
    this.kpiPerformance.forEach(kpi => {
      kpi.personsResponsible = kpiPersonsWithUserNames.filter(record => record.kpis_idkpis === kpi.idkpis);
    });
  }

  formatDescription() {
    if (this.projectDetails && this.projectDetails.length > 0) {
      this.formattedDescription = this.projectDetails[0].description.replace(/\n/g, '<br>');
    }
  }

  formatDate(dateString: string): string {
    return dateString.substring(0, 10);
  }

  calculateKpiStrPorcentAverage() {
    this.kpiStrPorcentSum = this.kpiPerformance.reduce((sum, kpi) => sum + parseFloat(kpi.kpi_str_porcent), 0);
    const totalKPIs = this.kpiPerformance.length;
    if (totalKPIs > 0) {
      this.kpiStrPorcentAverage = this.kpiStrPorcentSum / totalKPIs;
    }
    // Llamar a fillProgressBar después de calcular kpiStrPorcentAverage
    this.fillProgressBar();
  }


  /* fillProgressBar() {
    const progressBar = this.progressBar.nativeElement;
    const targetWidth = this.kpiStrPorcentAverage.toFixed(1);
    progressBar.style.width = `${targetWidth}%`;
    progressBar.innerText = `${targetWidth}%`;
  } */
  ngAfterViewInit() {
    setTimeout(() => {
      this.fillProgressBar();
    });
  }

  fillProgressBar() {
    if (this.progressBar) {
      const progressBar = this.progressBar.nativeElement;
      const targetWidth = this.kpiStrPorcentAverage.toFixed(1);
      progressBar.style.width = `${targetWidth}%`;
      progressBar.innerText = `${targetWidth}%`;
    } else {
    }
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }

  DescriptionTable(kpi: any) {
    kpi.showDescription = !kpi.showDescription;
  }

  isAdminRole(): boolean {
    return this.authServiceToken.getAccessRole() === 'ADMIN';
  }

  filterParticipants() {
    this.filteredParticipants = this.participantesDB.filter(participant => participant.project_idproject === this.projectID)
      .sort((a, b) => this.getUserName(a.person_idactive).localeCompare(this.getUserName(b.person_idactive)));
  }

  getUserName(personId: string): string {
    const user = this.usuariosDB.find(user => user.idactive === personId);
    return user ? user.full_name : '';
  }

  /* sortKpiPerformance() {
    this.kpiPerformance.sort((a, b) => a.name.localeCompare(b.name));
  } */
    sortKpiPerformance() {
      this.kpiPerformance.sort((a, b) => {
        // Parsea las fechas de término en objetos Date
        const dateA = new Date(a.end_date);
        const dateB = new Date(b.end_date);
    
        // Compara las fechas para determinar el orden
        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
        return 0;
      });
    }
    

  navigateToKpisView(projectId: string, projectName: string, status: string) {
    this.router.navigate(['/kpisview', projectId, { projectName }]);
    Environment.setProjectId(projectId);
    Environment.setusername(projectName);
    Environment.setProjectStatus(status);
  }

  redirectToPerformance(selectedKpi: any): void {
    this.router.navigate(['/performance', selectedKpi.idkpis], { state: { kpiData: selectedKpi } });
  }

}
