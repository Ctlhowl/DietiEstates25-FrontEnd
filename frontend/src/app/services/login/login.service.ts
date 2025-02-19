import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../../serialization/apiResponse';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiLogin = `${environment.apiAuth}`;
  private clientId = '138178385722-j0h9vks1bl6p20nq07a993h7195ai23g.apps.googleusercontent.com';

  constructor(private http: HttpClient) {}

  public initGoogleLogin(): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => this.handleGoogleSignIn(response)
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { size: "large", shape: "pill" }  // customization attributes
    );
  }

  // Gestisce la risposta del login
  private handleGoogleSignIn(response: any): void {
    const token = response.credential;
    console.log('Token ricevuto:', token);

    // Invia il token al backend per la verifica
    this.sendTokenToBackend(token);
  }


  private sendTokenToBackend(token: string): void {
    this.http.post<ApiResponse<{token: string}>>(this.apiLogin + '/google', { token })
      .subscribe({
        next:(response: ApiResponse<{token: string}>) => {
          console.log('Risposta dal backend:', response);
          this.saveToken(response.data.token)
          console.log(this.getUserId())
        },
        error: (error) => {
          console.error('Errore durante l\'invio del token:', error);
        }});
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
