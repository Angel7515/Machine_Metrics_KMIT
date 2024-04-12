import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllProjectsServiceService {
  api = Environment.API_URL+'api/dbprojects/all';

  constructor(private http: HttpClient) { }

  //Método para obtener proyectos
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
  
}
