import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UpdateKPIService {

  apiUrl = Environment.API_URL+'dbupKPI'

  constructor(private http: HttpClient) { }

  updateKpi(id: number, newData: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, newData);
  }
  
}
