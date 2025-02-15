import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationService } from '../../../services/location/location.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadFormComponent } from '../upload-form/upload-form.component';
import { Estate } from '../../../interfaces/estate';
import { Location } from '../../../interfaces/location';
import { EstateService } from '../../../services/estate/estate.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { S3File } from '../../../interfaces/s3File';
import { FileService } from '../../../services/file/file.service';
import { ApiResponse } from '../../../serialization/apiResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { AddonService } from '../../../services/addon/addon.service';
import { Addon } from '../../../interfaces/addon';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../interfaces/category';

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
  
  counties: County[] = [];
  cities: City[] = [];
  files: File[] = [];
  categories: Category[] = [];
  addons: Addon[] = [];

  selectedAddons: Addon[] = [];
  estateForm!: FormGroup;
  isEditMode = false;
  estateId: number | null = null;

  constructor(
    private estateService: EstateService,
    private locationService: LocationService,
    private categoryService: CategoryService,
    private fileService: FileService,
    private addonService: AddonService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.setEstateForm();
    this.setCountries();
    this.setAddons();
    this.setCategories();

    this.route.paramMap.subscribe(params => {
      this.estateId = params.get('id') == null ? -1 : Number(params.get('id'));
      if (this.estateId != -1) {
        this.isEditMode = true;
        this.loadEstateData();
      }
    });

  }

  /**
   * @description Initializes the estateForm with form controls and validation rules
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
        files: new FormArray([]),
      }
    )
  }

  /**
   * @description Initializes the addons
   */
  private setAddons() {
    this.addonService.getAll().subscribe(
      {
        next: (response: ApiResponse<Addon[]>) => {
          this.addons = response.data;
        },
        error: (err) => {
          console.log('Errore nel caricamento: ' + err.message);
        }
      }
    );
  }

  /**
   * @description Initializes the categories
   */
  private setCategories() {
    this.categoryService.getAll().subscribe(
      {
        next: (response: ApiResponse<Category[]>) => {
          this.categories = response.data;
        },
        error: (err) => {
          console.log('Errore nel caricamento: ' + err.message);
        }
      }
    );
  }

  /**
   * @description If the form was started in edit mode then it values the fields in the estate form
   */
  private loadEstateData() {
    this.estateService.getById(this.estateId!).subscribe(
      {
        next: (response: ApiResponse<Estate>) => {
          const data = response.data;
          const locationData = data.location;

          const estateForm  = {
            title: data.title,
            category: data.category,
            description: data.description,
            rental: data.rental ? "Affitto":  "Vendita",
            price: data.price,
            mtq: data.mtq,
            energyClass: data.energyClass,
            rooms:data.rooms,
            services: data.services,
            county:  locationData.countyCode + '-' + locationData.county,
            city: locationData.postalCode + '-' + locationData.city,
            street: locationData.street.split(", ")[0],
            streetNumber: locationData.street.split(", ")[1],
          }

          this.estateForm.patchValue(estateForm);
          

          this.loadAddonsData(data.addons);
          
          if (data.files) {
            this.loadFilesData(data.files);  
          }
        },
        error: (err) => {
          console.log('Errore nel caricamento: ' + err.message);
        }
      }
    );
  }
  
  /**
   * @description Values the addons in the estate form  
   */
  private loadAddonsData(addons: Addon[]): void {
    const addonsArray = this.estateForm.get('addons') as FormArray;

    addons.forEach((addon) => {
      addonsArray.push(new FormControl(addon.name));
    });
  }

  /**
   * @description Values the files in the estate form
   */
  private loadFilesData(files: S3File[]): void {
    const filesArray = this.estateForm.get('files') as FormArray;
    files.forEach((file) => {
      filesArray.push(new FormControl(file));
    });
  }
  
  /**
   * @description Retrive an estate object from estateForm
   * @returns Location object
   */
  private getEstateData(): Estate {
      return {
      id: this.estateId != -1 ? this.estateId : null, 
      title: this.estateForm.get('title')?.value,
      category: this.estateForm.get('category')?.value,
      description: this.estateForm.get('description')?.value,
      rental: this.estateForm.get('rooms')?.value == 'Affitto' ? true : false,
      price: this.estateForm.get('price')?.value,
      mtq: this.estateForm.get('mtq')?.value,
      energyClass: this.estateForm.get('energyClass')?.value,
      rooms: this.estateForm.get('rooms')?.value,
      services: this.estateForm.get('services')?.value,
      location: this.getLocationData(),
      userId: 1,
      addons: this.selectedAddons,
      files: this.getFileData()
    };
  }

  /**
   * @description Retrive a location object from estateForm
   * @returns Location object
   */
  private getLocationData(): Location { 
    const city = this.estateForm.get('city')?.value.split("-");
    const county = this.estateForm.get('county')?.value.split("-");
    
    return {
      countyCode: county[0],
      county: county[1],
      postalCode: city[0],
      city: city[1],
      street: this.estateForm.get('street')?.value + ', ' + this.estateForm.get('streetNumber')?.value
    };
  }

  /**
   * @description Retrive a list of files from uploadComponent
   */
  private getFileData(): S3File[] {
    if (this.uploadComponent) {
      this.uploadComponent.notify();
    }

    const savedFile: S3File[] = [];
    this.files.forEach((file: File) => {  
      const s3file = {
        name: file.name,
        contentType: file.type,
        size: file.size
      }

      savedFile.push(s3file)
    })

    return savedFile;
  }
  
  /**
   * @description Upload a file on S3
   * @param file File to be uploaded on S3
   */
  private uploadFileOnS3(file: File) {
    this.fileService.getPresignedUrl(file.name).subscribe(
      {
        next: (response: ApiResponse<string>) => {
          const presignedUrl = response.data;
          this.fileService.uploadFileToS3(presignedUrl, file).subscribe();
        },
        error: (err) => {
          console.log('Errore nel caricamento: ' + err.message);
        }
      }
    );
  }
  
  /**
   * @description Bind uploadComponent to this component to retrive file
   * @param {File} files List of files of uploadComponent
   */
   protected retriveFileFromUploader(files: File[]) {
    this.files = files;
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
          console.error('Errore durante il caricamento delle province:', err.message);
        },
        complete: () => {
          this.setCities(this.counties[0])
        }
      });
  }

  /**
   * @description Fetches a list of cities for a given county and populates the cities array.
   * @param {County} county - The county object containing a countyCode used to fetch cities. 
   */
  protected setCities(county: County): void {
    this.cities = [];
    this.spinner.show();
    
    
    this.locationService.getCities(county.countyCode).subscribe(
      {
        next: (response: any) => {
          response.forEach((data: any) => {
            const city: City = {
              city: data.denominazione_ita,
              postalCode: data.cap
            }

            this.cities.push(city);
          });
        },
        error: (err) => {
          console.error('Errore durante il caricamento delle province:', err.message);
        },
        complete: () => {
          setTimeout(() => { this.spinner.hide(); }, 400);
        }
      });
  }

  /**
   * @description Contact EstateHandle microservices to save the estate data
   */
  protected saveEstate() : void {
    this.spinner.show();

    const estate = this.getEstateData();

    this.files.forEach(file => {
      this.uploadFileOnS3(file);
    });
  
    this.estateService.save(estate).subscribe(
      {
        error: (err) => {
          console.log("Errore nel caricamento: " + err.message)
        },
        complete: () => {
          this.spinner.hide();
          this.router.navigate(['/estate']);
        }
      }
    );
  }

  /** 
   * @description Method to handle checkbox selection   
   * @param {Event} event event of checkbox
   */
  protected onAddonCheckbox(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const addon: Addon = {
      name: checkbox.value
    };

    if (checkbox.checked) {
      this.selectedAddons.push(addon)
    } else {
      const index = this.selectedAddons.findIndex(a => a.name === addon.name);
      if (index !== -1) {
        this.selectedAddons.splice(index, 1);
      }
    }
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