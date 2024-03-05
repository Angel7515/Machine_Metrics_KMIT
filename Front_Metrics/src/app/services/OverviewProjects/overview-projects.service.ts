import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OverviewProjectsService {

  api = Environment.API_URL + 'dboverviewP/summary'

  constructor(private http: HttpClient) { }

  getProjectSummary(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

}
