import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estate} from '../../interfaces/estate';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../serialization/apiResponse';
import { Filter } from '../../interfaces/filter';
import { FavoriteEstate } from '../../interfaces/favorite-estate';

@Injectable({
  providedIn: 'root'
})
export class EstateService {
  private apiEstateHandle = `${environment.apiEstateHandle}`;
  private apiEstateSearch = `${environment.apiEstateSearch}`

  constructor(private http: HttpClient) { }
  
  public getByFilter(filter: Filter): Observable<ApiResponse<Estate[]>> {
    return this.http.post<ApiResponse<Estate[]>>(`${this.apiEstateSearch}/estates`, filter);
  }

  public getById(id: number): Observable<ApiResponse<Estate>> {
    return this.http.get<ApiResponse<Estate>>(`${this.apiEstateSearch}/estates/${id}`);
  }

  public modifyFavoriteRelationship(favoriteEstate: FavoriteEstate): Observable<ApiResponse<Estate>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    });
    return this.http.post<ApiResponse<Estate>>(`${this.apiEstateHandle}/estates/favorite`, favoriteEstate, {headers});
  }
}
