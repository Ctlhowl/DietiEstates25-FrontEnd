import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Estate} from '../../interfaces/estate';
import { Observable } from 'rxjs';
import { Response } from '../../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class EstateService {
  private apiEstateHandle = `${environment.apiEstateHandle}`

  constructor(private http: HttpClient) { }

  public saveEstate(estate: Estate): Observable<Response<Estate>> {
    return this.http.post<Response<Estate>>(`${this.apiEstateHandle}`, estate);
  }

  public editEstate(estate: Estate): Observable<Response<Estate>> {
    return this.http.put<Response<Estate>>(`${this.apiEstateHandle}`, estate);
  }

  public deleteEstate(estateID: number): Observable<Response<Estate>> {
    return this.http.delete<Response<Estate>>(`${this.apiEstateHandle}`, { params: { id: estateID } });
  }
}
