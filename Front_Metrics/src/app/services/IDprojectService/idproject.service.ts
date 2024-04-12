import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IDprojectService {

  api = Environment.API_URL+'api/dbproject';
  
  constructor(private http: HttpClient) { }

  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

}
