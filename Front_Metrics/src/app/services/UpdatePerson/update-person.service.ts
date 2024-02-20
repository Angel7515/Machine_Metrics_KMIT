import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdatePersonService {

  private apiUrl = Environment.API_URL+'dbupdateuser';

  constructor(private http: HttpClient) { }

  updateRole(fullName: string, newRole: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateRole`, { fullName, newRole });
  }

}
