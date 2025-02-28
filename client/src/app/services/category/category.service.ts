import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { ApiResponse } from '../../serialization/apiResponse';
import { Category } from '../../interfaces/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
private apiEstateSearch = `${environment.apiEstateSearch}`

  constructor(private http: HttpClient) { }

   public getAll(): Observable<ApiResponse<Category []>> {
      return this.http.get<ApiResponse<Category []>>(`${this.apiEstateSearch}/categories`);
    }
}
