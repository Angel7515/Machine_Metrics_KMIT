import { Component, OnInit } from '@angular/core';
import { Environment } from '../../environments/environment';
import { CreateKpisService } from '../../services/CreateKpis/create-kpis.service';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';

import { GetParticipantsAllService } from '../../services/GetPersonProject/get-participants-all.service';
import { UsersService } from '../../services/AllUsers/users.service';

@Component({
  selector: 'app-kpis-add',
  templateUrl: './kpis-add.component.html',
  styleUrls: ['./kpis-add.component.css']
})
export class KpisAddComponent implements OnInit {

  kpiName: string = '';
  kpiType: string = '';
  kpiDescription: string = '';
  projectID: string = '';
  participantesDB: any[] = [];
  filteredParticipants: any[] = [];
  usuariosDB: any[] = [];
  combinedData: any[] = [];
  projectCreationSuccess: boolean = false;
  projectCreationError: boolean = false;
  
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private createKpisService: CreateKpisService,
    private authServiceToken: AuthServiceTokenService,
    private authService: MsalService,
    private router: Router,
    private participantsDB: GetParticipantsAllService,
    private userAllDB: UsersService
  ) { }

  ngOnInit() {
    this.loadParticipantes();
    this.loadUsuarios();
  }

  getAccountName(): any {
    let name = this.authService.instance.getActiveAccount()?.name;
    return name;
  }

  loadUsuarios() {
    this.userAllDB.getUsers().subscribe(
      (data: any[]) => {
        this.usuariosDB = data;
        this.combineData();
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

  filterParticipants() {
    this.projectID = Environment.getProjectId();
    this.filteredParticipants = this.participantesDB.filter(participant => {
      return participant.project_idproject === this.projectID;
    });
    this.combineData();
  }

  combineData() {
    if (this.filteredParticipants.length && this.usuariosDB.length) {
      this.combinedData = this.filteredParticipants.map(participant => {
        const user = this.usuariosDB.find(user => user.idactive === participant.person_idactive);
        return {
          person_idactive: participant.person_idactive,
          full_name: user ? user.full_name : 'Unknown',
          isResponsible: false
        };
      });
    }
  }

  toggleResponsibility(participant: any) {
    participant.isResponsible = !participant.isResponsible;
  }

  createKpi(): void {
    const formattedStartDate = this.formatDate(this.startDate);
    const formattedEndDate = this.formatDate(this.endDate);

    const responsibleParticipants = this.combinedData
      .filter(participant => participant.isResponsible)
      .map(participant => participant.person_idactive);

    // Verificar si no hay participantes responsables, añadir el usuario actual
    if (responsibleParticipants.length === 0) {
      responsibleParticipants.push(this.authServiceToken.getAccessIdactive());
    }

    const kpiData = {
      name: this.kpiName,
      type_kp: this.kpiType,
      importance: this.kpiDescription,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      project_idproject: Environment.projectId,
      project_person_idactive: this.authServiceToken.getAccessIdactive(),
      responsibleParticipants: responsibleParticipants
    };

    this.createKpisService.createKpi(kpiData).subscribe(
      response => {
        console.log('KPI created successfully:', response);
        this.projectCreationSuccess = true;
        this.projectCreationError = false;
        setTimeout(() => {
          this.navigateToKpisView();
        }, 2000);
      },
      error => {
        console.error('Error creating KPI:', error);
        this.projectCreationSuccess = false;
        this.projectCreationError = true;
        setTimeout(() => {
          this.projectCreationError = false;
        }, 2000);
      }
    );
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

  navigateToKpisView() {
    this.router.navigate(['/kpisview', Environment.getProjectId(), { projectName: Environment.getusername() }]);
  }
}
