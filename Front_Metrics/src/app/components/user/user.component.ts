import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/AllUsers/users.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';
import { UpdatePersonService } from '../../services/UpdatePerson/update-person.service';
import { CreatePersonsService } from '../../services/CreatePerson/create-persons.service';

let TokenAccess: string = '';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: any[] = [];
  foundUsers: any[] = []; // Nueva matriz para almacenar usuarios encontrados durante la búsqueda
  
  /* alert user */
  showAlert = false;

  constructor(
    private userService: UsersService,
    private authserviceToken: AuthServiceTokenService,
    private http: HttpClient,
    private personService: UpdatePersonService,
    private createPerson: CreatePersonsService
  ) { }

  ngOnInit(): void {
    this.getUsers();
    TokenAccess = this.authserviceToken.getAccessToken();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data: any[]) => {
        this.users = data;
      },
      (error) => {
        console.log('Error fetching users:', error);
      }
    );
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  onSearch(event: any): void {
    const query = event.target.value;
    if (query && query.trim() !== '') {
      this.searchUsers(query).subscribe(
        (data: any) => {
          const uniqueUsers: { id:string, full_name: string, user_role: string }[] = []; // Especificar el tipo de la variable uniqueUsers
          const foundUserNames = new Set(); // Conjunto para verificar nombres de usuario duplicados
  
          data.value.forEach((user: any) => {
            // Verificar si el nombre de usuario ya existe en la lista de usuarios
            const existingUser = this.users.find(u => u.full_name === user.displayName);
            if (!existingUser && !foundUserNames.has(user.displayName)) {
              // Si no existe en la lista de usuarios y en el conjunto de nombres, agregarlo
              foundUserNames.add(user.displayName);
              uniqueUsers.push({
                id: user.id,
                full_name: user.displayName,
                user_role: '' // Obtén el rol del usuario de tu fuente de datos
              });
            }
          });
  
          // Asignar el arreglo de usuarios únicos a foundUsers
          this.foundUsers = uniqueUsers;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      // Si el campo de búsqueda está vacío, mostrar todos los usuarios nuevamente
      this.foundUsers = [];
    }
  }
  
  private apiUrl = 'https://graph.microsoft.com/v1.0/users';

  searchUsers(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${TokenAccess}`
    });

    const params = new HttpParams().set('$filter', `startswith(mail, '${query}') or startswith(displayName, '${query}')`);

    return this.http.get(this.apiUrl, { headers: headers, params: params });
  }

  /* update */

  confirmUpdate(fullName: string, newRole: string): void {
    if (confirm(`Are you sure to assign ${fullName} the ${newRole} role?`)) {
      this.updateRole(fullName, newRole);
    }
  }

  updateRole(fullName: string, newRole: string): void {
    this.personService.updateRole(fullName, newRole).subscribe(
      response => {
        // Recargar la página en la ruta '/dbusers'
        window.location.href = '/dbusers';
      },
      error => {
        console.error('Error al actualizar usuario:', error);
      }
    );
  }

  /* create user */
  registerAs(idactive:string,fullName: string, role: string): void {
    console.log(idactive,' ----- ', fullName, ' ---- ', role);
    this.createPerson.createNewUser(idactive,fullName, role).pipe(
      tap(() => this.showAlert = true), // Mostrar la alerta
      switchMap(() => timer(2000)) // Esperar 2 segundos
    ).subscribe(() => {
      this.showAlert = false; // Ocultar la alerta después de 2 segundos
      this.getUsers(); // Obtener usuarios actualizados
    }, error => {
      console.error('Error al crear usuario:', error);
    });
  }
}
