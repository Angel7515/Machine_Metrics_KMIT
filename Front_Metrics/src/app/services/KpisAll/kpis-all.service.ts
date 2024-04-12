import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KpisAllService {

  private apiUrl = Environment.API_URL+'api/kpis'; // URL del servidor Node.js

  constructor(private http: HttpClient) { }

  // Método para obtener todos los KPIs del servidor
  getAllKPIs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

}
