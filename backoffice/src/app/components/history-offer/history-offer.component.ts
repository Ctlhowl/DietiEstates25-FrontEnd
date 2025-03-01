import { OfferService } from './../../services/offer/offer.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Offer } from '../../interfaces/offer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-history-offer',
  imports: [CommonModule,FormsModule],
  templateUrl: './history-offer.component.html',
  styleUrl: './history-offer.component.css'
})
export class HistoryOfferComponent implements OnChanges{
  
  protected offers: Offer[] = []
  protected activeOffers: Offer[] = []
  

  @Input() estateId!: number;
  

  constructor(private offerService: OfferService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['estateId'] && changes['estateId'].currentValue) {
      this.loadData(this.estateId);
    }
  }


  private loadData(estateId: number) {
    this.activeOffers = [];
    this.offers = [];
    this.offerService.getOffers(estateId, 1, 2).subscribe({
      next: (response) => {
          if (response?.data?.length) {
              response.data.forEach(offer => {
                  if(offer.status == 'DELIVERED'){
                    this.activeOffers.push(offer);
                  }else{
                    this.offers.push(offer);
                  }
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

  public onSave() { 
    const offer : Offer = {
      idEstate: this.estateId,
      price: 10000, 
      emailUser: 'nonjdsnkasmandkdmv',
      status: 'DELIVERED'
    };
    this.offerService.createOffer(offer).subscribe(
      {
        complete: () => {
          this.loadData(this.estateId);
        }
      });
  }

}
