import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { username, password });
  }

  register(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/register`, { username, password });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  isLoggedIn() {
    return !!this.getToken();
  }
  logout() {
    localStorage.removeItem('token');
  }
}
