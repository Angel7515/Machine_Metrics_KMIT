import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbKpisPersonService {

  private apiUrl = Environment.API_URL+'api/dbkpisperson'; 

  constructor(private http: HttpClient) { }

  getAllKpisPerson(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
