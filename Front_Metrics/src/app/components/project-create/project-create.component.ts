import { Component, OnInit } from '@angular/core';
import { CreatenewProjectService } from '../../services/CreateProject/createnew-project.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsersService } from '../../services/AllUsers/users.service';
import { CreatePersonProjectService } from '../../services/PersonProjecCreate/create-person-project.service';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';

import { MsalService } from '@azure/msal-angular';


@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css'
})

export class ProjectCreateComponent implements OnInit {

  users: any[] = [];
  searchText: string = '';
  filteredUsers: any[] = [];
  showTable: boolean = false;
  selectedUsers: any[] = [];
  idactive: string = this.authServiceToken.getAccessIdactive();
  projectData: any;
  projectCreationSuccess: boolean = false;
  projectCreationError: boolean = false;

  constructor(
    private projectService: CreatenewProjectService,
    private authService: MsalService,
    private router: Router,
    private userService: UsersService,
    private createPP: CreatePersonProjectService,
    private authServiceToken: AuthServiceTokenService
  ) {
    this.searchText = '';
    this.projectData = {};
  }

  ngOnInit() {
    this.getUsers();
    //this.idactive = this.authServiceToken.getAccessIdactive();
    this.initializeProjectData();
  }

  getAccountName() {
    let name = this.authService.instance.getActiveAccount()?.name;
    return name
  }

  initializeProjectData() {
    this.projectData = {
      project_name: '',
      description: '',
      start_date: '',
      status_project: 'CREATED',
      person_idactive: this.idactive // id del usuario responsable 
    };
  }

  createProject(): void {
    console.log('data de envio',this.projectData)
    this.projectService.createProject(this.projectData)
      .subscribe({
        next: response => {
          console.log(response); // Manejar la respuesta del servidor
          // Marcar la creación del proyecto como exitosa
          this.projectCreationSuccess = true;
          this.projectCreationError = false;
          // Iniciar temporizador para redirigir después de 3 segundos (ajusta el tiempo según sea necesario)
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        },
        error: error => {
          console.error('Error al crear proyecto:', error); // Manejar el error
          // Marcar la creación del proyecto como fallida
          this.projectCreationSuccess = false;
          this.projectCreationError = true;
          setTimeout(() => {
            this.projectCreationError = false;
          }, 2000);
        }
      });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data: any[]) => {
        this.users = data;
        this.filteredUsers = data; // Inicialmente, mostrar todos los usuarios
      },
      (error) => {
        console.log('Error fetching users:', error);
      }
    );
  }

  filterUsers(): void {
    if (this.users && this.users.length > 0) {
      this.filteredUsers = this.users.filter(user =>
        user.full_name && user.full_name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredUsers = [];
    }
    this.showTable = this.searchText.trim().length > 0;
  }



  addUser(user: any): void {
    // Verificar si el usuario ya ha sido agregado
    if (!this.selectedUsers.some(u => u.full_name === user.full_name)) {
      // Clonar el objeto user antes de agregarlo
      let clonedUser = Object.assign({}, user);
      this.selectedUsers.push(clonedUser);
    }
  }


  deleteUser(user: any): void {
    this.selectedUsers = this.selectedUsers.filter(u => u !== user);
  }

}
