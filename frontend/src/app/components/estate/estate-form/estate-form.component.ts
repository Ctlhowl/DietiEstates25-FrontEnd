import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../services/location/location.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type County = {
  county: string,
  countyCode: string
};

type City = {
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

  estateForm!: FormGroup;
  files: File[] = [];

  constructor(private locationService: LocationService){}
  
  ngOnInit(): void {
    this.setCountries();
    this.createForm();
  }

  /**
   * @description Initializes the estateForm with form controls and validation rules.
   */
  private createForm() {
    this.estateForm = new FormGroup(
      {
        //title: new FormControl(null, Validators.required),
        //category: new FormControl(null, Validators.required),
        //description: new FormControl(null, Validators.required),
        //rental: new FormControl(true, Validators.required),
        //price: new FormControl(1, [Validators.required, Validators.min(1)]),
        mtq: new FormControl(1, [Validators.required, Validators.min(1)]),
        energyClass: new FormControl('A3', Validators.required),
        rooms: new FormControl(1, [Validators.required, Validators.min(1)]),
        services: new FormControl(1, [Validators.required, Validators.min(1)]),
        //location: new FormControl(null, Validators.required),
        userId: new FormControl(1, Validators.required),
        addons: new FormControl(null),
        files: new  FormControl(null, Validators.required)
      }
    )
  }

  /**
   * @description Fetches a list of counties and populates the counties array.
   */
  protected setCountries(): void {
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

  /**
   * @description Fetches a list of cities for a given county and populates the cities array.
   * 
   * @param {County} county - The county object containing a countyCode used to fetch cities. 
   */
  protected setCities(county: County): void{
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

  /**
   * @description Contact EstateHandle microservices to save the estate data
   */
  protected saveEstate() {
    
  }

  /**
   * @description Sets the file to be passed to the modal
   * @param file 
   */
  protected onModalDeleteFile(file: File) {
    
  }
}
