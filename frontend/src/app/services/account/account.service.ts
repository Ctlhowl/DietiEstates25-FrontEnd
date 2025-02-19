import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../serialization/apiResponse';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environments';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiAccount = `${environment.apiAccount}`; 

  constructor(private http: HttpClient) { }

  public getUserInfo(): Observable <ApiResponse<User>> {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      console.error("Errore: Nessun ID utente trovato nel localStorage!");
      return throwError(() => new Error("User non trovato"));
    }

    const headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });

    return this.http.get<ApiResponse<User>>(`${this.apiAccount}/${userId}`,{headers}); 
  }
  

  updateUser(updatedUser: User): Observable<ApiResponse<User>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.put<ApiResponse<User>>(`${this.apiAccount}`,updatedUser,{headers});
  }
}
