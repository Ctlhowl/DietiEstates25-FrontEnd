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
    return this.http.post<ApiResponse<Estate>>(`${this.apiEstateHandle}/estates`, estate);
  }

  public edit(estate: Estate): Observable<ApiResponse<Estate>> {
    return this.http.put<ApiResponse<Estate>>(`${this.apiEstateHandle}/estates`, estate);
  }

  public delete(estateId: number): Observable<ApiResponse<Estate>> {
    return this.http.delete<ApiResponse<Estate>>(`${this.apiEstateHandle}/estates`, { params: { estate: estateId } });
  }

  public getByFilter(filter: Filter): Observable<ApiResponse<Estate[]>> {
    return this.http.post<ApiResponse<Estate[]>>(`${this.apiEstateSearch}/estates`, filter);
  }

  public getById(id: number): Observable<ApiResponse<Estate>> {
    return this.http.get<ApiResponse<Estate>>(`${this.apiEstateSearch}/estates/${id}`);
  }
}
