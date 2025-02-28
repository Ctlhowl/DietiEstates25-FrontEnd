import { Component, OnInit } from '@angular/core';
import { Category } from '../../interfaces/category';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CategoryService } from '../../services/category/category.service';
import { LocationService } from '../../services/location/location.service';

type County = { county: string; countyCode: string };
type City = { city: string; postalCode: string };

@Component({
  selector: 'app-filter',
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit{
  protected isAdvanceSearchVisible: boolean = false;

  protected InputFormCategories: Category[] = [];
  protected InputFormCounties: County[] = [];
  protected InputFormCities: City[] = [];

  constructor(
    private categoryService: CategoryService,
    private locationService: LocationService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  /**
   * @description Load Select and Checkbox input
   */
  private loadInitialData(): void {
    this.categoryService.getAll().subscribe(response => this.InputFormCategories = response.data);

    this.locationService.getCountries().subscribe(
      {
        next: (response: any) => {
          this.InputFormCounties = response.map((county: any) => ({
            county: county.denominazione_provincia,
            countyCode: county.sigla_provincia
          }));
        },
      });
    }
  
  /**
   * @description Fetches a list of cities for a given county and populates the InputFormCities.
   * @param {County} county - The county object containing a countyCode used to fetch cities. 
   */
  protected loadCities(county: County): void {
    this.InputFormCities = [];
    this.spinner.show();
    
    
    this.locationService.getCities(county.countyCode).subscribe(
      {
        next: (response: any) => {
          response.forEach((data: any) => {
            const city: City = { city: data.denominazione_ita, postalCode: data.cap };
            this.InputFormCities.push(city);
          });
        },
        complete: () => {
          setTimeout(() => { this.spinner.hide(); }, 400);
        }
      });
  }

  protected onAdvanceSearch() {
    this.isAdvanceSearchVisible = !this.isAdvanceSearchVisible;
  }
}
