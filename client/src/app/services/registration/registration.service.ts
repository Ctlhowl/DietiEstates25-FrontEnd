import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../../../../../backoffice/src/app/serialization/apiResponse';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiRegistration = `${environment.apiAuth}`;

  constructor(private http: HttpClient) { }

  register(userData: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiRegistration}/register`, userData);
  }
}
