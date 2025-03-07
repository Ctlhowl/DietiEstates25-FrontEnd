import { environment } from './../../../environments/environments';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../../backoffice/src/app/serialization/apiResponse';

declare var google: any;
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiLogin = `${environment.apiAuth}`;
  private clientId = '138178385722-j0h9vks1bl6p20nq07a993h7195ai23g.apps.googleusercontent.com';

  constructor(private http: HttpClient) {}

  public initGoogleLogin(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => {
          if (response.credential) {
            this.handleGoogleSignIn(response);
            observer.next(true);
            observer.complete();
          } else {
            observer.error('Google login failed');
          }
        }
      });
  
      google.accounts.id.prompt();
  
    });
  }

  private handleGoogleSignIn(response: any): void {
    const token = response.credential;
    console.log('Token ricevuto:', token);

    this.sendTokenToBackend(token);
  }


  private sendTokenToBackend(token: string): void {
    this.http.post<ApiResponse<{token: string}>>(this.apiLogin + '/google', { token })
      .subscribe({
        next:(response: ApiResponse<{token: string}>) => {
          this.saveToken(response.data.token)
        },
        error: (error) => {
          console.error('Errore durante l\'invio del token:', error);
        },
        complete:() => {
          window.location.reload();
        },
      });
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<{token: string}>> {
    return this.http.post<ApiResponse<{token: string}>>(`${this.apiLogin}/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    
    const decodedToken = this.decodeToken(token);
    if (decodedToken) {
      localStorage.setItem('userId', decodedToken.id); 
      localStorage.setItem('userRole', decodedToken.role);
      localStorage.setItem('userEmail', decodedToken.email);
      if (this.getUserRole() === 'ROLE_MANAGER' || this.getUserRole() === 'ROLE_ADMIN'){
        localStorage.setItem('userAgency', decodedToken.agency);
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

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  decodeToken(token: string): any {
    try {      
      const parts = token.split('.');
      if (parts.length !== 3) {
          console.error('Invalid token format');
          return null;
      }

      const payload = token.split('.')[1];
      const decoded = atob(payload); 
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Errore nella decodifica del token', error);
      return null;
    }
  }
}
