import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UPloadProjectService {

  private api = Environment.API_URL + 'dbputprojects'

  constructor(private http: HttpClient) { }

  uploadProjectData(projectID:any,projectData: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${projectID}`, projectData);
  }

}
