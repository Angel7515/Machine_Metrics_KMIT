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
  styleUrl: './project-edit.component.css'
})
export class ProjectEditComponent implements OnInit {

  projectID: string = '';
  projectDetails: any;
  selectedStatus: string = '';
  endDate: Date | null = null; // Ajusta el tipo de endDate a string
  selectedStartDate: any = null;
  selectedEndDate: any = null; // Declaración de selectedEndDate
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
    private router: Router, // Inyecta el módulo Router
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

  getAccountName() {
    let name = this.authService.instance.getActiveAccount()?.name;
    return name;
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


  // Método para cargar los detalles del proyecto
  loadProjectDetails(projectID: string) {
    this.projectService.getProjectById(projectID).subscribe(
      (data: any) => {
        this.projectDetails = data;
        this.projectDetails[0].start_date = this.projectDetails[0].start_date.substring(0, 10);
        this.selectedStatus = this.projectDetails[0].status_project;
        this.selectedStartDate = this.projectDetails[0].start_date; // Inicializar selectedStartDate con la fecha de inicio actual
        this.idperson_has_project = this.projectDetails[0].idproject;//id del proyecto
        if (this.selectedStatus === 'COMPLETE') {
          this.projectDetails[0].end_date = this.projectDetails[0].end_date.substring(0, 10);
          this.selectedEndDate = this.projectDetails[0].end_date;
        }
      },
      error => {
        console.log('Error al obtener los detalles del proyecto:', error);
      }
    );
  }


  /* get participants in the project */

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


  // Método para cargar los datos del proyecto
  uploadProjectData(): void {
    const startDateInput = document.getElementById('startDate') as HTMLInputElement;
    const projectNameInput = document.getElementById('projectName') as HTMLInputElement;
    const projectDescriptionInput = document.getElementById('projectDescription') as HTMLTextAreaElement;

    if (projectNameInput && projectDescriptionInput && startDateInput) {
      const projectName = projectNameInput.value;
      const projectDescription = projectDescriptionInput.value;

      // Verifica si startDateInput tiene un valor
      const selectedStartDate = startDateInput.value ? startDateInput.value : this.selectedStartDate;

      // Verifica si el estado es "COMPLETE" y obtén la fecha de finalización si es necesario
      if (this.selectedStatus === 'COMPLETE') {
        const endDateInput = document.getElementById('endDate') as HTMLInputElement;
        if (endDateInput && endDateInput.value) { // Verifica si se ha seleccionado una fecha
          this.selectedEndDate = endDateInput.value; // Actualiza selectedEndDate con la fecha seleccionada
          this.isEndDateSelected = true; // Marcar como verdadero si se selecciona una fecha de término
          this.projectCreationSuccess = true;
          this.projectCreationError = false;
        } else {
          this.projectCreationSuccess = false;
          this.projectCreationError = true;
          this.isEndDateSelected = false; // Marcar como falso si no se selecciona una fecha de término
          return;
        }
      }

      // Envía los datos al servidor solo si la fecha de término está seleccionada o si el estado no es "COMPLETE"
      if (this.selectedStatus !== 'COMPLETE' || this.isEndDateSelected) {
        const formData = {
          project_name: projectName,
          description: projectDescription,
          start_date: selectedStartDate,
          end_date: this.selectedEndDate,
          status_project: this.selectedStatus,
          person_idactive: this.authserviceToken.getAccessIdactive()
        };

        // Llama al servicio para cargar los datos del proyecto
        this.uploadService.uploadProjectData(this.projectID, formData)
          .subscribe(
            response => {
              this.projectCreationSuccess = true;
              this.projectCreationError = false;
              //console.log('Datos enviados exitosamente al servidor:', response);

              // Oculta la notificación después de 2 segundos y redirige a la página de inicio
              setTimeout(() => {
                this.projectCreationSuccess = false;
                this.router.navigate(['/home']);
              }, 2000);
            },
            error => {
              console.error('Error al enviar datos al servidor:', error);
              this.projectCreationSuccess = false;
              this.projectCreationError = true;
              // Maneja el error según sea necesario
            }
          );
      } else {
        console.error('Fecha de término no seleccionada.');
      }
    } else {
      console.error('Elementos projectName, projectDescription o startDate no encontrados.');
    }
    this.associateUsersWithProject();
  }

  // Función para asociar usuarios con el proyecto
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

  /* obtener todos los usuarios - participants */
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

  /* si participante existe */
  isUserRegistered(user: any): boolean {
    return this.getparticipantsAll.some(participant =>
      participant.person_idactive === user.idactive &&
      participant.project_idproject === this.idperson_has_project
    );
  }


  /* remove user */
  removeParticipantFromProject(user: any): void {
    this.deletePersonP.deletePersonProject(user.idactive).subscribe(
      () => {
        // Eliminación exitosa, recargar la lista de personas registradas en el proyecto
        this.getAllPersonProjects();
      },
      error => {
        console.error('Error al eliminar la persona del proyecto:', error);
        // Manejar el error según sea necesario
      }
    );
  }


}
