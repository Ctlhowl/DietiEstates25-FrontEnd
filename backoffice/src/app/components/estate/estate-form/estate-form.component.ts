import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationService } from '../../../services/location/location.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadFormComponent } from '../upload-form/upload-form.component';
import { Estate } from '../../../interfaces/estate';
import { Location } from '../../../interfaces/location';
import { EstateService } from '../../../services/estate/estate.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { S3File } from '../../../interfaces/s3File';
import { ApiResponse } from '../../../serialization/apiResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { AddonService } from '../../../services/addon/addon.service';
import { Addon } from '../../../interfaces/addon';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../interfaces/category';
import { take } from 'rxjs';

type County = { county: string; countyCode: string };
type City = { city: string; postalCode: string };

@Component({
  selector: 'app-estate-form',
  imports: [
    ReactiveFormsModule,
    UploadFormComponent,
    NgxSpinnerModule
  ],
  standalone: true,
  templateUrl: './estate-form.component.html',
  styleUrl: './estate-form.component.css'
})
export class EstateFormComponent implements OnInit{
  @ViewChild(UploadFormComponent) uploadComponent!: UploadFormComponent;

  protected InputFormCounties: County[] = [];
  protected InputFormCities: City[] = [];
  protected InputFormFiles: File[] = [];
  protected InputFormCategories: Category[] = [];
  protected InputFormAddons: Addon[] = [];

  protected estateForm!: FormGroup;
  protected isEditMode = false;
  private estateId: number | null = null;

  constructor(
    private estateService: EstateService,
    private locationService: LocationService,
    private categoryService: CategoryService,
    private addonService: AddonService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.initializeForm();
    this.loadInitialData();
    this.checkEditMode();
  }
  
  /**
   * @description Initializes the estateForm with form controls and validation rules.
   */
  private initializeForm() {
    this.estateForm = new FormGroup({
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
      files: new FormArray([]),
    });
  }

  /**
   * @description Load Select and Checkbox input
   */
  private loadInitialData(): void {
    this.addonService.getAll().subscribe(response => this.InputFormAddons = response.data);
    this.categoryService.getAll().subscribe(response => this.InputFormCategories = response.data);

    this.locationService.getCountries().subscribe(
      {
        next: (response: any) => {
          this.InputFormCounties = response.map((county: any) => ({
            county: county.denominazione_provincia,
            countyCode: county.sigla_provincia
          }));
        },
        complete: () => {
          this.loadCities(this.InputFormCounties[0]);
        }
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

  /**
   * @description Check whether the form is in edit or new mode.
   * If it is in edit mode, loads data into the input fields
   */
  private checkEditMode(): void {
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      this.estateId = params.get('id') ? Number(params.get('id')) : null;
  
      if (this.estateId) {
        this.isEditMode = true;
        this.loadEstateData(this.estateId);
      }
    });
  }
  

  /**
   * @description If the form was started in edit mode then it values the fields in the estate form
   * @param {number} estateId Estate's id to load
   */
  private loadEstateData(estateId: number) : void {
    this.estateService.getById(estateId).subscribe(
      {
        next: (response: ApiResponse<Estate>) => {
          const estate = response.data;
          
          this.loadCities({ countyCode: estate.location.countyCode, county: estate.location.county });
          this.estateForm.patchValue(this.mapEstateToForm(estate));

          const addonsArray = this.estateForm.get('addons') as FormArray;
          estate.addons.forEach((addon) => { addonsArray.push(new FormControl(addon.name)); });
          
          const filesArray = this.estateForm.get('files') as FormArray;
          estate.files.forEach((file) => { filesArray.push(new FormControl(file)); });
        },
        error: (err) => {
          console.log('Errore nel caricamento: ' + err.message);
        }
      }
    );
  }

  /**
   * @description Map the estate data in the form data
   * @param {Estate} estate Estate data
   * @returns Returns an object that can be put into the form
   */
  private mapEstateToForm(estate: Estate): any {
    const location = estate.location;

    return {
      title: estate.title,
      category: estate.category.name,
      description: estate.description,
      rental: estate.rental ? 'Affitto' : 'Vendita',
      price: estate.price,
      mtq: estate.mtq,
      energyClass: estate.energyClass,
      rooms: estate.rooms,
      services: estate.services,
      county: `${location.countyCode}-${location.county}`,
      city: `${location.postalCode}-${location.city}`,
      street: location.street.split(', ')[0],
      streetNumber: location.street.split(', ')[1],
    };
  }

  /**
   * @description Map the form data in the estate data
   * @returns {Estate} Estate object
   */
  private mapFormToEstate(): Estate {
    return {
      id: this.estateId,
      title: this.estateForm.get('title')?.value,
      category: this.estateForm.get('category')?.value,
      description: this.estateForm.get('description')?.value,
      rental: this.estateForm.get('rental')?.value === 'Affitto',
      price: this.estateForm.get('price')?.value,
      mtq: this.estateForm.get('mtq')?.value,
      energyClass: this.estateForm.get('energyClass')?.value,
      rooms: this.estateForm.get('rooms')?.value,
      services: this.estateForm.get('services')?.value,
      location: this.mapFormToLocation(),
      userId: 1,
      addons: this.mapFormToAddons(),
      files: this.mapUploadComponentToS3File()
    };
  }

  /**
   * @description Map the addons' form section into list of Addon data
   * @returns {Addon[]} List of Addon object
   */
  private mapFormToAddons(): Addon[] {
    const selectedCheckboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked');
    return Array.from(selectedCheckboxes).map(addon => ({ name: addon.value }));
  }

  /**
   * @description Map the location's form section in Location data
   * @returns {Location} Location object
   */
  private mapFormToLocation(): Location { 
    const [postalCode, city] = this.estateForm.get('city')?.value.split('-');
    const [countyCode, county] = this.estateForm.get('county')?.value.split('-');
    return { countyCode, county, postalCode, city, street: `${this.estateForm.get('street')?.value}, ${this.estateForm.get('streetNumber')?.value}` };

  }

  /**
   * @description Map the data form UploadComponent into list of S3File data
   * @returns {S3File []} List of S3File
   */
  private mapUploadComponentToS3File(): S3File[] {
    this.uploadComponent.notify();

    const savedFile: S3File[] = [];
    this.InputFormFiles.forEach((file: File) => {  
      const s3file: S3File = {
        name: file.name,
        contentType: file.type,
        size: file.size
      };

      savedFile.push(s3file);
    })

    return savedFile;
  }
  
  /**
   * @description Bind uploadComponent to this component to retrive file
   * @param {File} files List of files of uploadComponent
   */
   protected bindFormToUploadComponent(files: File[]): void {
    this.InputFormFiles = files;
  }

  /**
   * @description Contact EstateHandle microservices to save the estate data
   */
  protected saveEstate() : void {
    this.spinner.show();
    const estate = this.mapFormToEstate();

    this.estateService.save(estate).subscribe(
      {
        complete: () => {
          setTimeout(() => {
            this.spinner.hide(); 
            this.router.navigate(['/estate']);
          }, 600);
        }
      }
    );
  }

  /**
   * @description Select checkbox that contains addon's estate 
   * @param {string} addonName name of addon 
   * @returns {boolean} true if addon is present, false otherwise 
   */
  protected isAddonSelected(addonName: string): boolean {
    return this.estateForm.get('addons')?.value.includes(addonName);
  }
}