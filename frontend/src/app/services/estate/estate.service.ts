import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Estate} from '../../interfaces/estate';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../serialization/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class EstateService {
  private apiEstateHandle = `${environment.apiEstateHandle}`

  constructor(private http: HttpClient) { }

  public saveEstate(estate: Estate): Observable<ApiResponse<Estate>> {
    return this.http.post<ApiResponse<Estate>>(`${this.apiEstateHandle}`, estate);
  }

  public editEstate(estate: Estate): Observable<ApiResponse<Estate>> {
    return this.http.put<ApiResponse<Estate>>(`${this.apiEstateHandle}`, estate);
  }

  public deleteEstate(estateID: number): Observable<ApiResponse<Estate>> {
    return this.http.delete<ApiResponse<Estate>>(`${this.apiEstateHandle}`, { params: { id: estateID } });
  }
}
