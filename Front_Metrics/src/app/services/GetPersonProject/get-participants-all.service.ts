import { Injectable } from '@angular/core';
import { Environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetParticipantsAllService {

  api = Environment.API_URL+'api/dbpersonHasProjects/all'

  constructor(private http: HttpClient) { }

  getAllPersonProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

}
