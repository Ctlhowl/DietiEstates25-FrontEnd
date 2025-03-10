import { OfferService } from './../../services/offer/offer.service';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
  counterOffer: number | null = null;
  externalOffer: number | null = null;
  externalEmail: string = '';
  

  @Input() estateId!: number;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();  

  constructor(private offerService: OfferService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['estateId'] && changes['estateId'].currentValue) {
      this.loadData(this.estateId);
    }
  }

  private loadData(estateId: number) {
    this.activeOffers = [];
    this.offers = [];
    this.offerService.getOffers(estateId).subscribe({
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

  public translate(status: string): string {
    if(status === 'DECLINED'){
      return "RIFIUTATO"
    }
    if(status === 'ACCEPTED'){
      return "ACCETTATO"
    }
    if(status === 'DELIVERED'){
      return "IN ATTESA"
    }
    
    return "CONTROFFERTA"
  }
  
  public onSave() { 
    const offer : Offer = {
      idEstate: this.estateId,
      price: this.externalOffer!, 
      emailUser: this.externalEmail,
      status: 'DELIVERED'
    };
    this.offerService.createOffer(offer).subscribe(
      {
        complete: () => {
          this.loadData(this.estateId);
          this.close();
        }
      });
  }

  onSubmitCounterOffer(retrievedOffer: Offer, newPrice: number) {
    this.offerService.updateOffer(retrievedOffer.id!,'DECLINED').subscribe(
      {
        complete: () => {
          const offer : Offer = {
            price: newPrice, 
            idEstate: this.estateId,
            emailUser: retrievedOffer.emailUser,
            status: 'COUNTEROFFER'
          };
          this.offerService.createOffer(offer).subscribe(
            {
              complete: () => {
                this.loadData(this.estateId);
                this.close();
              }
            });
          }
      });
  }

  public close() {
    this.isVisible = false;
    this.closeModal.emit();
  }
}
