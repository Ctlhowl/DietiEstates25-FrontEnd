import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Estate} from '../../interfaces/estate';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../serialization/apiResponse';
import { Filter } from '../../interfaces/filter';

@Injectable({
  providedIn: 'root'
})
export class EstateService {
  private apiEstateHandle = `${environment.apiEstateHandle}`;
  private apiEstateSearch = `${environment.apiEstateSearch}`

  constructor(private http: HttpClient) { }

  public save(estate: Estate): Observable<ApiResponse<Estate>> {
    return this.http.post<ApiResponse<Estate>>(`${this.apiEstateHandle}`, estate);
  }

  public edit(estate: Estate): Observable<ApiResponse<Estate>> {
    return this.http.put<ApiResponse<Estate>>(`${this.apiEstateHandle}`, estate);
  }

  public delete(estateID: number): Observable<ApiResponse<Estate>> {
    return this.http.delete<ApiResponse<Estate>>(`${this.apiEstateHandle}`, { params: { id: estateID } });
  }

  public getByFilter(filter: Filter): Observable<ApiResponse<Estate[]>> {
    return this.http.post<ApiResponse<Estate[]>>(`${this.apiEstateSearch}`, filter);
  }
}
