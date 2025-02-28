import { ApiResponse } from './../../serialization/apiResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private apiRetrievingEmployees = `${environment.apiBackoffice}`;
  private apiUser = `${environment.apiAccount}`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<ApiResponse<User[]>> {
    const agency = localStorage.getItem('userAgency');
    const headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.get<ApiResponse<User[]>>(`${this.apiRetrievingEmployees}?agency=${agency}`, {headers});
  }

  deleteEmployee(id: number | undefined): Observable<ApiResponse<void>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.delete<ApiResponse<void>>(`${this.apiUser}?userId=${id}`, {headers});
  }
}
