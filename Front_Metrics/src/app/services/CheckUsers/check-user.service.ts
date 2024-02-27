import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckUserService {

  private api = Environment.API_URL + 'dbcheckUser/checkUserAccess';

  constructor(private http: HttpClient) { }

  checkUserAccess(idactive: string, full_name: String): Observable<any> {
    return this.http.post<any>(this.api, { idactive: idactive, full_name: full_name }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // Manejar el estado 403 aquí (acceso denegado)
          return throwError({ accessGranted: false });
        } else {
          // Manejar otros errores
          return throwError(error);
        }
      })
    );
  }
}
