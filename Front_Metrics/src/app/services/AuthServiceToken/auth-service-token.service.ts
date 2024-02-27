import { Injectable } from '@angular/core';
import { Environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceTokenService {

  private accessTokenKey = 'accessToken'; // Key for localStorage
  private accessName = 'accessName';
  private accessRole = 'accessRole';
  private accessIDactive = 'accessIDactive_user';

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

  setAccessName(name:string){
    localStorage.setItem(this.accessName,name);
  }

  getAccessName(): string {
    return localStorage.getItem(this.accessName) ?? ''; 
  }

  setAccessRole(role:string){
    localStorage.setItem(this.accessRole,role);
  }

  getAccessRole(): string {
    return localStorage.getItem(this.accessRole) ?? ''; 
  }

  setAccessIdactive(idactive:string) {
    localStorage.setItem(this.accessIDactive,idactive);
  }

  getAccessIdactive():string{
    return localStorage.getItem(this.accessIDactive) ?? '';
  }

}
