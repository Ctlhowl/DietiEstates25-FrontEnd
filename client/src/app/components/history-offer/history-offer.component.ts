import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Offer } from '../../interfaces/offer';
import { OfferService } from '../../services/offer/offer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history-offer',
  imports: [CommonModule],
  templateUrl: './history-offer.component.html',
  styleUrl: './history-offer.component.css'
})
export class HistoryOfferComponent implements OnChanges{
  @Input() estateId!: number;

  protected offers: Offer[] = []

  constructor(private offerService: OfferService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['estateId'] && changes['estateId'].currentValue) {
      this.loadData(this.estateId);
    }
  }

  private loadData(estateId: number) {
    this.offers = [];
    this.offerService.getOffers(estateId, 1, 20).subscribe({
      next: (response) => {
          if (response?.data?.length) {
              response.data.forEach(offer => {
                  this.offers.push(offer);
              });
          } else {
              console.log('Nessuna offerta trovata.');
          }
      },
      error: (error) => {
          console.error('Errore nel recupero delle offerte:', error);
      }
    });
  }

  public onAccept(offerId: number){
    this.offerService.updateOffer(offerId,'ACCEPTED').subscribe(
      {
        complete: () => {
          this.loadData(this.estateId);
        }
      });
  }

  public onReject(offerId: number) {
    this.offerService.updateOffer(offerId,'DECLINED').subscribe(
      {
        complete: () => {
          this.loadData(this.estateId);
        }
      });
  }
}
