import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetPerformanceService {

  private baseUrl = Environment.API_URL+'api/dbgetperformance'; // URL base para las solicitudes

  constructor(private http: HttpClient) { }

  // Función para obtener todas las entradas de performance
  getAllPerformances(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  
}
