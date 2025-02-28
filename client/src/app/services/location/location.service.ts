import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private countiesJSON = 'assets/db/gi_province.json'
  private citiesJSON = 'assets/db/gi_comuni_cap.json'
  
  constructor(private http: HttpClient) { }

  getCountries(): Observable<any>{
    return this.http.get<any>(this.countiesJSON);
  }

  getCities(countyCode: string): Observable<any>{
    return this.http.get<any>(this.citiesJSON).pipe(
      map((cities: any[]) => cities.filter(city => city.sigla_provincia == countyCode))
    );
  } 
}
