import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreatePerformanceService {

  private baseUrl = Environment.API_URL+'dbcreate/performance'; // URL base para las solicitudes

  constructor(private http: HttpClient) { }

  // Función para crear una nueva entrada de performance
  createPerformance(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

}
