import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchOnePersonService {

  private api = Environment.API_URL+'dbOneP'

  constructor(private http: HttpClient) { }

  getPersonNameByIdActive(idactive: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${idactive}`);
  }
}
