import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpdateKPIService } from '../../services/UpKPI/update-kpi.service';
import { Environment } from '../../environments/environment';
import { UsersService } from '../../services/AllUsers/users.service';
import { DbKpisPersonService } from '../../services/kpisResponsable/db-kpis-person.service';
import { GetParticipantsAllService } from '../../services/GetPersonProject/get-participants-all.service';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';

@Component({
  selector: 'app-kpi-edit',
  templateUrl: './kpi-edit.component.html',
  styleUrls: ['./kpi-edit.component.css']
})
export class KpiEditComponent implements OnInit {
  kpiData: any;
  kpiId: string = '';
  kpiName: string = '';
  kpiType: string = '';
  kpiDescription: string = '';
  startDate: string = '';
  endDate: string = '';
  projectCreationSuccess: boolean = false;
  projectCreationError: boolean = false;
  participantesDB: any[] = [];
  filteredParticipants: any[] = [];
  usuariosDB: any[] = [];
  kpiResponsibles: any[] = [];
  combinedData: any[] = [];
  projectID: string = '';
  dataLoadedCount: number = 0;
  currentUser: string = '';

  constructor(
    private router: Router,
    private Updatekpi: UpdateKPIService,
    private userAllDB: UsersService,
    private dbKpisPersonService: DbKpisPersonService,
    private participantsDB: GetParticipantsAllService,
    private authServiceToken: AuthServiceTokenService
  ) { }

  ngOnInit(): void {
    this.kpiData = history.state.kpiData;
    /* console.log(this.kpiData); */
    if (this.kpiData) {
      this.kpiId = this.kpiData.idkpis;
      this.kpiName = this.kpiData.name;
      this.kpiDescription = this.kpiData.importance;
      this.startDate = this.kpiData.start_date;
      this.endDate = this.kpiData.end_date;
    }

    this.loadParticipantes();
    this.loadUsuarios();
    this.loadResponsibles();
    this.currentUser = this.authServiceToken.getAccessIdactive(); // Obtener el usuario actual
  }


  loadUsuarios() {
    this.userAllDB.getUsers().subscribe(
      (data: any[]) => {
        this.usuariosDB = data;
        this.checkDataLoaded();
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
        this.checkDataLoaded();
      },
      error => {
        console.log('Error al obtener los participantes:', error);
      }
    );
  }

  loadResponsibles() {
    this.dbKpisPersonService.getAllKpisPerson().subscribe(
      (data: any[]) => {
        this.kpiResponsibles = data;
        this.checkDataLoaded();
      },
      error => {
        console.log('Error al obtener los responsables:', error);
      }
    );
  }

  filterParticipants() {
    this.projectID = Environment.getProjectId();
    this.filteredParticipants = this.participantesDB.filter(participant => {
      return participant.project_idproject === this.projectID;
    });
  }

  checkDataLoaded() {
    this.dataLoadedCount++;
    if (this.dataLoadedCount === 3) {
      this.combineData();
    }
  }

  combineData() {
    if (this.filteredParticipants.length && this.usuariosDB.length && this.kpiResponsibles.length) {
      // Combinar los participantes filtrados con el servicio DbKpisPersonService
      const allParticipants = this.filteredParticipants.map(participant => {
        const user = this.usuariosDB.find(user => user.idactive === participant.person_idactive);
        const isResponsible = this.kpiResponsibles.some(responsible =>
          responsible.person_idactive === participant.person_idactive && responsible.kpis_idkpis === this.kpiId
        );
        return {
          person_idactive: participant.person_idactive,
          full_name: user ? user.full_name : 'Unknown',
          isResponsible: isResponsible
        };
      });

      // Añadir los participantes del servicio DbKpisPersonService que no se encuentran en los filtrados
      this.kpiResponsibles.forEach(responsible => {
        if (!allParticipants.some(participant => participant.person_idactive === responsible.person_idactive)) {
          const user = this.usuariosDB.find(user => user.idactive === responsible.person_idactive);
          allParticipants.push({
            person_idactive: responsible.person_idactive,
            full_name: user ? user.full_name : 'Unknown',
            isResponsible: responsible.kpis_idkpis === this.kpiId
          });
        }
      });

      this.combinedData = allParticipants;
    }
  }

  toggleResponsibility(participant: any) {
    participant.isResponsible = !participant.isResponsible;
  }

  updateKpi(): void {
    const newData = {
      idkpis: this.kpiData.idkpis,
      name: this.kpiName,
      type_kp: this.kpiData.type_kp,
      importance: this.kpiDescription,
      start_date: this.startDate,
      end_date: this.endDate,
      project_idproject: this.kpiData.project_idproject,
      project_person_idactive: this.kpiData.project_person_idactive,
      responsibles: this.combinedData.map(participant => ({
        idkpis: this.kpiData.idkpis,
        project_idproject: this.kpiData.project_idproject,
        person_id: participant.person_idactive,
        responsibility: participant.isResponsible ? 'Responsible' : 'Remove'
      }))
    };

    console.log('Data to be sent:', newData);

    this.Updatekpi.updateKpi(this.kpiData.idkpis, newData)
      .subscribe(
        response => {
          this.projectCreationSuccess = true;
          this.projectCreationError = false;
          setTimeout(() => {
            this.navigateToKpisView();
          }, 2000);
        },
        error => {
          this.projectCreationSuccess = false;
          this.projectCreationError = true;
          setTimeout(() => {
            this.projectCreationError = false;
          }, 2000);
        }
      );
  }

  isAnyParticipantResponsible(): boolean {
    return this.combinedData.some(participant => participant.isResponsible);
  }

  navigateToKpisView() {
    this.router.navigate(['/kpisview', Environment.getProjectId(), { projectName: Environment.getusername() }]);
  }

  formatDate(date: any): string {
    if (!date) return '';
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
}
