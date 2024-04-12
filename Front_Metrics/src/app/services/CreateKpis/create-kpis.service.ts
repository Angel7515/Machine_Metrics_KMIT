import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateKpisService {

  private apiUrl = Environment.API_URL+'api/dbkpis/kpis';

  constructor(private http: HttpClient) { }

  // Método para crear un nuevo KPI
  createKpi(kpiData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, kpiData);
  }
  
}
