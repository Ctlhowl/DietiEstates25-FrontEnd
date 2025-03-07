import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { Estate } from '../../interfaces/estate';
import { EstateService } from '../../services/estate/estate.service';
import { ApiResponse } from '../../serialization/apiResponse';
import { Filter } from '../../interfaces/filter';
import { OfferService } from '../../services/offer/offer.service';
import { Offer } from '../../interfaces/offer';
import { FavoriteEstate } from '../../interfaces/favorite-estate';


@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterLink, FilterComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  protected estates: Estate[] = [];
  protected favoriteEstate: Estate[] = [];
  protected estate?: Estate;
  protected isLogged: boolean = false;
  protected favoriteRoute: boolean = false;
  protected historyRoute: boolean = false;

  protected filters: Filter = {
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
    },
    userId: undefined,
    favorite: undefined
  };

  constructor(
    private offerService: OfferService,
    private estateService: EstateService,
    private router: Router) { }
  
  ngOnInit(): void {
    this.isLogged = localStorage.getItem("authToken") != null ? true : false;
    this.favoriteRoute = this.router.url === '/estates/favorites' ? true : false;
    this.historyRoute = this.router.url === '/estates/my-offers' ? true : false;

    this.loadEstates();
  }

  private loadEstates() {
    if (this.historyRoute) {
      this.loadEstatesByOffer();
      return ;
    }
    
    if (this.favoriteRoute) {
      this.loadFavoriteEstate();
      return;
    }

    this.loadFavoriteEstate();
    this.loadEstatesByFilter(this.filters);
  }
  
  private loadFavoriteEstate() {
    const filter: Filter = {
      userId: Number(localStorage.getItem("userId")),
      favorite: true,
    }

    this.loadEstatesByFilter(filter);
  }

  private loadEstatesByOffer() {
    const email = localStorage.getItem("userEmail");

    this.offerService.getHistoryOfferByUser(email!).subscribe(
      {
        next: (response: ApiResponse<Offer[]>) => {
          const offers = response.data;
          offers.forEach((offer: Offer) => {
            this.estateService.getById(offer.idEstate!).subscribe(
              {
                next: (response: ApiResponse<Estate>) => {
                  this.estates.push(response.data);
                },
              }
            );
          });
        }
      }
    );
  }

  /**
   * @description Load estate data
   */
  private loadEstatesByFilter(filter: Filter): void {
    this.estateService.getByFilter(filter).subscribe(
      {
        next: (response: ApiResponse<Estate[]>) => {
          if (filter.favorite) {
            this.favoriteEstate = response.data;
          }
          
          this.estates = response.data;
        },
        error: (err) => {
          console.error('Errore durante il caricamento delle inserzioni:', err);
        }
      }
    );
  }

  protected applyFiltersOnEstates(newFilters: Filter) {
    this.filters = newFilters;
    this.loadEstatesByFilter(this.filters);
  }

  /**
   * @description Check if the estate has been added to favorites
   */
  protected isFavorite(estateId: number): boolean {
    return this.favoriteEstate.find(fe => fe.id == estateId) ? true : false;
  }

  /**
   * @description Add or Remove favorite relationship between user and estate
   * @param estateId ID of estate
   */
  protected toggleFavorite(estateId: number) {
    const favoriteEstate: FavoriteEstate = {
      userId: Number(localStorage.getItem("userId")),
      estateId: estateId,
      addToFavorite: !this.isFavorite(estateId)
    };

    console.log(favoriteEstate);

    this.estateService.modifyFavoriteRelationship(favoriteEstate).subscribe(
      {
        complete: () => {
          this.loadEstates();
        }
      }
    );
  }
} 
