import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  api = Environment.API_URL+'api/dbusers/all'

  constructor(private http: HttpClient) { }

  //Método para obtener usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

}
