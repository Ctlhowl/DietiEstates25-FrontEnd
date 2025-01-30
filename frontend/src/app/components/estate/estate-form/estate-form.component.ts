import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../services/location/location.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadFormComponent } from '../upload-form/upload-form.component';
import { Estate } from '../../../interfaces/estate';
import { Location } from '../../../interfaces/location';
import { Addons } from '../../../interfaces/addons';
import { EstateService } from '../../../services/estate/estate.service';

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
  imports: [ReactiveFormsModule, UploadFormComponent],
  standalone: true,
  templateUrl: './estate-form.component.html',
  styleUrl: './estate-form.component.css'
})
export class EstateFormComponent implements OnInit{
  counties: County[] = [];
  cities: City[] = [];
  isLoading: boolean = false;

  estateForm!: FormGroup;

  constructor(private locationService: LocationService, private estateService: EstateService){}
  
  ngOnInit(): void {
    this.setCountries();
    this.setEstateForm();
  }

  /**
   * @description Initializes the estateForm with form controls and validation rules.
   */
  private setEstateForm() {
    this.estateForm = new FormGroup(
      {
        title: new FormControl(null, Validators.required),
        category: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        rental: new FormControl(true, Validators.required),
        price: new FormControl(1, [Validators.required, Validators.min(1)]),
        mtq: new FormControl(1, [Validators.required, Validators.min(1)]),
        energyClass: new FormControl('A3', Validators.required),
        rooms: new FormControl(1, [Validators.required, Validators.min(1)]),
        services: new FormControl(1, [Validators.required, Validators.min(1)]),
        county: new FormControl(null, Validators.required),
        city: new FormControl(null, Validators.required),
        street: new FormControl(null, Validators.required),
        streetNumber: new FormControl(null, Validators.required),
        addons: new FormArray([]),
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
   * @description Getter to access the FormArray 
   * 
  */
protected get addons(): FormArray {
  return this.estateForm.get('addons') as FormArray;
}

/** 
 * @description Method to handle checkbox selection 
 * */
protected onCheckboxChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const addonsArray = this.addons;
  const value = checkbox.value;

  if (checkbox.checked) {
    addonsArray.push(new FormControl(value)); 
  } else {
    const index = addonsArray.controls.findIndex(control => control.value === value);
    if (index !== -1) {
      addonsArray.removeAt(index);
    }
  }
}


  /**
   * @description Contact EstateHandle microservices to save the estate data
   */
  protected saveEstate() {
    this.estateService.saveEstate(this.getEstateData()).subscribe();
  }

  /**
   * @description Retrive an estate object from estateForm
   * @returns Location object
   */
  private getEstateData(): Estate {
    const rental = this.estateForm.get('rooms')?.value == 'Affitto' ? true : false;
    const location = this.getLocationData();

    return {
      title: this.estateForm.get('title')?.value,
      category: this.estateForm.get('category')?.value,
      description: this.estateForm.get('description')?.value,
      rental: rental,
      price: this.estateForm.get('price')?.value,
      mtq: this.estateForm.get('mtq')?.value,
      energyClass: this.estateForm.get('energyClass')?.value,
      rooms: this.estateForm.get('rooms')?.value,
      services: this.estateForm.get('services')?.value,
      location: location,
      userId: 1,
      addons: this.addons.controls.map(control => control.value),
    };
  }

  /**
   * @description Retrive a location object from estateForm
   * @returns Location object
   */
  private getLocationData(): Location {
    const street = this.estateForm.get('street')?.value + ' ' + this.estateForm.get('streetNumber')?.value 
    const postalCode = this.estateForm.get('city')?.value.postalCode;
    const city = this.estateForm.get('city')?.value.city;

    return {
      county: this.estateForm.get('county')?.value,
      city: city,
      postalCode: postalCode,
      street: street
    };
  }
}
