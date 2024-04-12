import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CreatenewProjectService {

  constructor(private http: HttpClient) { }

  createProject(projectData: any): Observable<any> {
    console.log('data enviada final front',projectData)
    return this.http.post<any>(Environment.API_URL+'api/dbNewproject/create', projectData);
  }

}
