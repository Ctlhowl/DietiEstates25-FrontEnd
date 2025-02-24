import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../../serialization/apiResponse';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiLogin = `${environment.apiAuth}`;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<ApiResponse<{token: string}>> {
    return this.http.post<ApiResponse<{token: string}>>(`${this.apiLogin}/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    
    const decodedToken = this.decodeToken(token);
    if (decodedToken) {
      localStorage.setItem('userId', decodedToken.id); 
      localStorage.setItem('userRole', decodedToken.role);
      if (this.getUserRole() === 'ROLE_MANAGER' || this.getUserRole() === 'ROLE_ADMIN'){
        localStorage.setItem('userAgency',decodedToken.agency);
      }
    } 
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserAgency(): string | null {
    return localStorage.getItem('userAgency');
  }

  decodeToken(token: string): any {
    try {
      console.log(token)
      
      const parts = token.split('.'); // Divide il JWT in tre parti
      if (parts.length !== 3) {
          console.error('Invalid token format');
          return null;
      }

      const payload = token.split('.')[1];
      const decoded = atob(payload); 
      return JSON.parse(decoded); // Converte in oggetto JS
    } catch (error) {
      console.error('Errore nella decodifica del token', error);
      return null;
    }
  }
}
