import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeletePersonProjectService {

  private baseUrl = Environment.API_URL+'dbdeletePerPro';

  constructor(private http: HttpClient) { }

  deletePersonProject(personIdActive: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${personIdActive}`);
  }
  
}
