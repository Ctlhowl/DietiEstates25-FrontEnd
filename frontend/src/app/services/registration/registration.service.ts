import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../../serialization/apiResponse';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiRegistration = `${environment.apiBackoffice}`;

  constructor(private http: HttpClient) { }

  getAvailableRoles(): string[] {
    const role = localStorage.getItem("userRole");
    if (role === 'ROLE_ADMIN') {
      return ['MANAGER', 'AGENT']; // L'admin può creare sia manager che agenti
    } else if (role === 'ROLE_MANAGER') {
      return ['AGENT']; // Il manager può creare solo agenti
    }
    return [];
  }


  register(userData: User): Observable<ApiResponse<User>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.post<ApiResponse<User>>(`${this.apiRegistration}`, userData ,{ headers });
  }
}
