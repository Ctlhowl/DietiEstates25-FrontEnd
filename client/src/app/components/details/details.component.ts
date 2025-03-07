import { Component, OnInit, ViewChild } from '@angular/core';
import { EstateService } from '../../services/estate/estate.service';
import { Estate } from '../../interfaces/estate';
import { ApiResponse } from '../../serialization/apiResponse';
import { CommonModule } from '@angular/common';
import L from "leaflet";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HistoryOfferComponent } from "../history-offer/history-offer.component";
import { Poi } from '../../interfaces/poi';
import { FavoriteEstate } from '../../interfaces/favorite-estate';
import { Filter } from '../../interfaces/filter';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterLink, HistoryOfferComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  @ViewChild(HistoryOfferComponent) historyOfferComponent!: HistoryOfferComponent;
    
  protected isLogged: boolean = false;
  protected estate!: Estate;
  protected favoriteEstate: Estate[] = [];
  protected categoryCountMap: { [key: string]: number } = {};

  private map!: L.Map;

  constructor(private estateService: EstateService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!)
    this.isLogged = localStorage.getItem("authToken") != null ? true : false;
    this.loadEstate(id);
    this.loadFavoriteEstate();
  }

  /**
   * @description Load estate data
   * @param id Id of estate to load
   */
  private loadEstate(id: number): void {
    this.estateService.getById(id).subscribe(
      {
        next: (response: ApiResponse<Estate>) => {
          this.estate = response.data;
        },
        complete: () => {
          if (this.estate) {
            this.loadMap();
            this.getCategoryCount(this.estate.location.poi!);
          } else {
            console.error('Estate data or location is missing');
          }
        },
      }
    );
  }

  private loadFavoriteEstate() {
      const filter: Filter = {
        userId: Number(localStorage.getItem("userId")),
        favorite: true,
      }
  
      this.estateService.getByFilter(filter).subscribe(
        {
          next: (response: ApiResponse<Estate[]>) => {
              this.favoriteEstate = response.data;
          },
          error: (err) => {
            console.error('Errore durante il caricamento delle inserzioni:', err);
          }
        }
      );
    }

  /**
   * @description Load map component and set markers
   */
  private loadMap(): void {
    const lat = this.estate.location.lat!;
    const lng = this.estate.location.lng!;

    this.map = L.map('map').setView([lat, lng], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    L.circle([lat, lng], {
      fillColor: '#0077b6',
      fillOpacity: 0.3,
      radius: 500
    }).addTo(this.map);

    this.setMarkers(lat, lng)
  }

  /**
   * @description Set a marker for the estate and for each poi within a 500m radius 
   * @param lat Latitude of estate
   * @param lng Longitude of estate
   */
  private setMarkers(lat: number, lng: number): void {
    const markerIcon = new L.Icon({
      iconUrl: './assets/icons/marker-40.png',
      iconSize: [40, 40],
      popupAnchor: [0, -20]
    })

    const estateIcon = new L.Icon({
      iconUrl: './assets/icons/house-40.png',
      iconSize: [30, 30],
      popupAnchor: [0, -10]
    })

    L.marker([lat, lng], { icon: estateIcon })
      .addTo(this.map)
      .bindPopup(this.estate.category.name);

    this.estate.location.poi?.forEach(poi => {
      L.marker([poi.lat, poi.lng], { icon: markerIcon })
        .addTo(this.map)
        .bindPopup(poi.category);
    });
  }

  /**
   * @description Foreach poi count how many there are
   * @param poiList List of poi
   */
  private getCategoryCount(poiList: Poi []): void {
    this.categoryCountMap = poiList.reduce((acc: any, poi: Poi) => {
      acc[poi.category] = (acc[poi.category] || 0) + 1;
      return acc;
    }, {});

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

    this.estateService.modifyFavoriteRelationship(favoriteEstate).subscribe(
      {
        complete: () => {
          this.loadFavoriteEstate();
        },
      }
    );
  }

}
