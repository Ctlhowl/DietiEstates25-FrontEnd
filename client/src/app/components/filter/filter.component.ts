import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Category } from '../../interfaces/category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CategoryService } from '../../services/category/category.service';
import { LocationService } from '../../services/location/location.service';
import { Filter } from '../../interfaces/filter';

type County = { county: string; countyCode: string };
type City = { city: string; postalCode: string };

@Component({
  selector: 'app-filter',
  imports: [ReactiveFormsModule, NgxSpinnerModule,FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit{
  protected isAdvanceSearchVisible: boolean = false;

  protected InputFormCategories: Category[] = [];
  protected InputFormCounties: County[] = [];
  protected InputFormCities: City[] = [];
  protected fullCounty: string | undefined = undefined;
  protected fullCity: string | undefined = undefined;

  filters: Filter = { 
    category:undefined,
    rental: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minMtq: undefined,
    maxMtq: undefined,
    minRooms: undefined,
    location: {
      county: undefined,
      city: undefined
    }
  };

  @Output() filtersChanged = new EventEmitter<Filter>();

  constructor(
    private categoryService: CategoryService,
    private locationService: LocationService,
    private spinner: NgxSpinnerService
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
  
 
  protected loadCities(event: any): void {
    const county = event.target.value;
    this.InputFormCities = [];
    this.spinner.show();
    
    const countyCode = county.split('-')[0];
    this.locationService.getCities(countyCode).subscribe(
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

  applyFilters() {
    if(this.fullCounty){
      this.formatCounty(this.fullCounty);
    } else {
      this.filters.location!.county=undefined;
    }
    
    if(this.fullCity){
      this.formatCity(this.fullCity);
    }else {
      this.filters.location!.city=undefined;
    }
    
    this.filtersChanged.emit(this.filters);
  }

  private formatCounty(rawCounty: string){
    this.filters.location!.county = rawCounty.split('-')[1];
  }

  private formatCity(rawCity: string){
    this.filters.location!.city = rawCity.split('-')[1];
  }
}
