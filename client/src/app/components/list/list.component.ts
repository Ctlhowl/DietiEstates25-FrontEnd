import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { Estate } from '../../interfaces/estate';
import { EstateService } from '../../services/estate/estate.service';
import { ApiResponse } from '../../serialization/apiResponse';
import { Filter } from '../../interfaces/filter';


@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterLink, FilterComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  protected estates: Estate[] = [];
  protected estate?: Estate;
  protected iconName: string = 'favorite_border';

  filters: Filter = { 
    category: undefined,
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

  constructor(private estateService: EstateService) { }
  
  ngOnInit(): void {
    this.loadEstates();
  }

  /**
   * @description Load estate data
   */
  private loadEstates(): void {
    this.estateService.getByFilter(this.filters).subscribe(
      {
        next: (response: ApiResponse<Estate[]>) => {
          this.estates = response.data;
        },
        error: (err) => {
          console.error('Errore durante il caricamento delle inserzioni:', err);
        }
      });
  }

  applyFiltersOnEstates(newFilters: Filter) {
    this.filters = newFilters;  // Aggiorna i filtri con quelli nuovi
    this.loadEstates();  // Richiama la funzione per ottenere i dati con i nuovi filtri
  }

  /**
   * @description Check if the estate has been added to favorites
   */
  get isFavorite(): boolean {
    return true;
  }
}
