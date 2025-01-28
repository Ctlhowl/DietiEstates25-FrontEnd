import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../services/location/location.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export type County = {
  county: string,
  countyCode: string
};

export type City = {
  city: string
  postalCode: string
}

@Component({
  selector: 'app-estate-form',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './estate-form.component.html',
  styleUrl: './estate-form.component.css'
})
export class EstateFormComponent implements OnInit{
  counties: County[] = [];
  cities: City[] = [];
  isLoading: boolean = false;

  constructor(private locationService: LocationService){}
  
  ngOnInit(): void {
    this.setCountries();
  }

  setCountries(): void {
    this.locationService.getCountries().subscribe(
      {
        next: (response: any) => {
          response.forEach((county: any) => {
            this.counties.push({
              county: county.denominazione_provincia,
              countyCode: county.sigla_provincia
            })
          });
        },
        error: (err) => {
          console.error('Errore durante il caricamento delle province:', err);
        },
        complete: () => {
          this.setCities(this.counties[0])
        }
      });
  }

  setCities(county: County): void{
    this.cities = [];
    this.isLoading = true;

    this.locationService.getCities(county.countyCode).subscribe(
      {
        next: (response: any) => {
          response.forEach((city: any) => {
            this.cities.push({
              city: city.denominazione_ita,
              postalCode: city.cap
            })
          });
        },
        error: (err) => {
          console.error('Errore durante il caricamento delle province:', err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

}
