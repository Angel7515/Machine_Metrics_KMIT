import { Injectable } from '@angular/core';
import { Environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {

  api = Environment.API_URL + 'dbpersonproject/person_has_project'

  constructor(private http: HttpClient) { }

  // Método para insertar un nuevo registro en person_has_project
  createPersonProject(person_idactive: string, project_idproject: number): Observable<any> {
    const body = { person_idactive, project_idproject };
    return this.http.post<any>(this.api, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError('Error en la solicitud. Por favor, inténtalo de nuevo más tarde.');
  }
}
