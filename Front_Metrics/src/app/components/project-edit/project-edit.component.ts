import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UPdateIDProjectsService } from '../../services/getUPdateIdprojects/update-idprojects.service';
import { Environment } from '../../environments/environment';
import { UPloadProjectService } from '../../services/UploadProjects/upload-project.service';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';
import { MsalService } from '@azure/msal-angular';
import { UsersService } from '../../services/AllUsers/users.service';
import { ParticipantsService } from '../../services/CreatePersonroject/participants.service';
import { GetParticipantsAllService } from '../../services/GetPersonProject/get-participants-all.service';
import { DeletePersonProjectService } from '../../services/DeletePersonPro/delete-person-project.service';
import { Router } from '@angular/router'; // Importa el módulo Router

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {

  projectID: string = '';
  projectDetails: any;
  selectedStatus: string = '';
  selectedStartDate: string = ''; // Ajusta el tipo a string
  selectedEndDate: string = ''; // Ajusta el tipo a string
  isEndDateSelected: boolean = false;
  projectCreationSuccess: boolean = false;
  projectCreationError: boolean = false;
  users: any[] = [];
  searchResults: any[] = [];
  participants: any[] = [];
  idperson_has_project: number = 0;
  getparticipantsAll: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: UPdateIDProjectsService,
    private uploadService: UPloadProjectService,
    private authService: MsalService,
    private authserviceToken: AuthServiceTokenService,
    private router: Router,
    private usersAll: UsersService,
    private participantsService: ParticipantsService,
    private getparticipants: GetParticipantsAllService,
    private deletePersonP: DeletePersonProjectService
  ) { }

  ngOnInit() {
    this.projectID = Environment.getProjectId();
    this.loadProjectDetails(this.projectID);
    this.loadUsers();
    this.getAllPersonProjects();
  }

  loadUsers(): void {
    this.usersAll.getUsers().subscribe(
      (users: any[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error al cargar los datos de los usuarios:', error);
      }
    );
  }

  loadProjectDetails(projectID: string) {
    this.projectService.getProjectById(projectID).subscribe(
      (data: any) => {
        this.projectDetails = data;
        // Ajusta la fecha de inicio al formato deseado
        this.selectedStartDate = this.projectDetails[0].start_date ? this.projectDetails[0].start_date.substring(0, 10) : '';
        this.selectedEndDate = this.projectDetails[0].end_date ? this.projectDetails[0].end_date.substring(0, 10) : '';
        this.selectedStatus = this.projectDetails[0].status_project;
        this.idperson_has_project = this.projectDetails[0].idproject;
        console.log(this.selectedEndDate);
      },
      error => {
        console.log('Error al obtener los detalles del proyecto:', error);
      }
    );
  }

  getAllPersonProjects(): void {
    this.getparticipants.getAllPersonProjects().subscribe(
      (data: any[]) => {
        this.getparticipantsAll = data;
      },
      error => {
        console.error('Error al obtener los datos de personas y proyectos:', error);
      }
    );
  }

  uploadProjectData(): void {
    const startDateInput = document.getElementById('startDate') as HTMLInputElement;
    const endDateInput = document.getElementById('endDate') as HTMLInputElement;
    const projectNameInput = document.getElementById('projectName') as HTMLInputElement;
    const projectDescriptionInput = document.getElementById('projectDescription') as HTMLTextAreaElement;

    if (projectNameInput && projectDescriptionInput && startDateInput) {
      const projectName = projectNameInput.value;
      const projectDescription = projectDescriptionInput.value;
      const selectedStartDate = startDateInput.value ? startDateInput.value : this.selectedStartDate;
      const selectedEndDate = endDateInput.value ? endDateInput.value : this.selectedEndDate; // Usa el valor de la fecha de finalización actual si no se selecciona una nueva fecha

      const formData = {
        project_name: projectName,
        description: projectDescription,
        start_date: selectedStartDate,
        end_date: selectedEndDate,
        status_project: this.selectedStatus,
        person_idactive: this.authserviceToken.getAccessIdactive()
      };

      this.uploadService.uploadProjectData(this.projectID, formData)
        .subscribe(
          response => {
            this.projectCreationSuccess = true;
            this.projectCreationError = false;

            setTimeout(() => {
              this.projectCreationSuccess = false;
              this.router.navigate(['/home']);
            }, 2000);
          },
          error => {
            console.error('Error al enviar datos al servidor:', error);
            this.projectCreationSuccess = false;
            this.projectCreationError = true;
          }
        );
    } else {
      console.error('Elementos projectName, projectDescription o startDate no encontrados.');
    }
    this.associateUsersWithProject();
  }

  associateUsersWithProject(): void {
    this.participants.forEach(participant => {
      this.participantsService.createPersonProject(participant.idactive, this.idperson_has_project)
        .subscribe(
          response => {
            //console.log('Asociación creada correctamente:', response);
          },
          error => {
            console.error('Error al crear la asociación:', error);
          }
        );
    });
  }

  searchUsers(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (searchTerm !== '') {
      this.searchResults = this.users.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    } else {
      this.searchResults = [];
    }
  }

  addParticipant(user: any) {
    if (!this.participants.some(participant => participant.idactive === user.idactive)) {
      this.participants.push(user);
    }
  }

  removeParticipant(index: number) {
    this.participants.splice(index, 1);
  }

  isUserRegistered(user: any): boolean {
    return this.getparticipantsAll.some(participant =>
      participant.person_idactive === user.idactive &&
      participant.project_idproject === this.idperson_has_project
    );
  }

  removeParticipantFromProject(user: any): void {
    this.deletePersonP.deletePersonProject(user.idactive).subscribe(
      () => {
        this.getAllPersonProjects();
      },
      error => {
        console.error('Error al eliminar la persona del proyecto:', error);
      }
    );
  }
}
