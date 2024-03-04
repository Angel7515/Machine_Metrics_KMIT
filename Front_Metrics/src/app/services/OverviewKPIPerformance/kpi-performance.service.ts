import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KpiPerformanceService {

  apiUrl = Environment.API_URL+'dboverview'

  constructor(private http: HttpClient) { }

  getKpisByProject(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${projectId}`);
  }
  
}
