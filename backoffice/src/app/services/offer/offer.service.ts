import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Offer } from '../../interfaces/offer';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../serialization/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiOffers = `${environment.apiOffer}`;

  constructor(private http: HttpClient) { }

  public getOffers(estateId: number,page: number,pageSize: number): Observable <ApiResponse<Offer[]>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    console.log(estateId)
    return this.http.get<ApiResponse<Offer[]>>(`${this.apiOffers}/${estateId}?page=${page}&pageSize=${pageSize}`, { headers });
  }

  public updateOffer(offerId: number,status: string): Observable <ApiResponse<Offer>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.patch<ApiResponse<Offer>>(`${this.apiOffers}/${offerId}?status=${status}`, null, {headers});
  }

  public createOffer(offer: Offer): Observable<ApiResponse<Offer>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    return this.http.post<ApiResponse<Offer>>(`${this.apiOffers}`, offer , {headers});
  }
}
