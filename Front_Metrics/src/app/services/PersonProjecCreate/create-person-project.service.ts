import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreatePersonProjectService {

  private api = Environment.API_URL+'dbcreatePersonProject/personhasproject'; // Cambia la URL según tu configuración de backend

  constructor(private http: HttpClient) { }

  // Método para agregar un nuevo registro a person_has_project
  createPersonHasProject(personFullName: string, projectIdProject: number): Observable<any> {
    const body = { person_full_name: personFullName, project_idproject: projectIdProject };
    return this.http.post<any>(this.api, body);
  }
  
}
