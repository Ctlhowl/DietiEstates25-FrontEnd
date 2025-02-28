import { Component, Input, OnInit } from '@angular/core';
import { Offer } from '../../interfaces/offer';
import { OfferService } from '../../services/offer/offer.service';

@Component({
  selector: 'app-history-offer',
  imports: [],
  templateUrl: './history-offer.component.html',
  styleUrl: './history-offer.component.css'
})
export class HistoryOfferComponent{
  
  protected offers: Offer[] = []
  protected activeOffers: Offer[] = []

  @Input() estateId!: number;

  constructor(private offerService: OfferService) {
    this.loadData(this.estateId)
  }

  private loadData(estateId: number) {
    this.activeOffers = [
      {
        id: 1,
        price: 1000,
        emailUser: 'emailprova',
        idEstate: 9,
        status: "Delivered",
        updatedAt: "23-02-2025"
      },
      {
        id: 2,
        price: 1002,
        emailUser: 'Delivered',
        idEstate: 9,
        status: "Attesa",
        updatedAt: "24-02-2025"
      }
    ]


    this.offers = [
      {
        id: 1,
        price: 1000,
        emailUser: 'emailprova',
        idEstate: 9,
        status: "Rfiutato",
        updatedAt: "23-02-2025"
      },
      {
        id: 2,
        price: 1002,
        emailUser: 'emailprova',
        idEstate: 9,
        status: "Rfiutato",
        updatedAt: "24-02-2025"
      }
    ];
  }
}
