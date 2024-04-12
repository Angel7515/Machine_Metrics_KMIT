import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreatePersonsService {

  private api = Environment.API_URL+'api/dbcreateperson'

  constructor(private http: HttpClient) { }

  createNewUser(idactive:string, fullName: string, userRole: string): Observable<any> {
    return this.http.post<any>(`${this.api}/create`, {idactive, fullName, userRole });
  }
  
}
