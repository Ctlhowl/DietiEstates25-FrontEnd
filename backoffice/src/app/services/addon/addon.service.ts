import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../serialization/apiResponse';
import { Addon } from '../../interfaces/addon';

@Injectable({
  providedIn: 'root'
})
export class AddonService {
  private apiEstateSearch = `${environment.apiEstateSearch}`

  constructor(private http: HttpClient) { }

  public getAll(): Observable<ApiResponse<Addon []>> {
    return this.http.get<ApiResponse<Addon []>>(`${this.apiEstateSearch}/addons`);
  }
}
