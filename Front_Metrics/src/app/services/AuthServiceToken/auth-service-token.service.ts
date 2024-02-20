/* import { Injectable } from '@angular/core';
import { Environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceTokenService {

  private accessToken: string = '';

  constructor() { }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

}
 */

import { Injectable } from '@angular/core';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceTokenService {

  private accessTokenKey = 'accessToken'; // Key for localStorage

  constructor() { }

  setAccessToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token); // Store token in localStorage
  }

  getAccessToken(): string {
    return localStorage.getItem(this.accessTokenKey) ?? ''; // Return an empty string if the token is null
  }

  clearAccessToken() {
    localStorage.removeItem(this.accessTokenKey); // Remove token from localStorage
  }

}
