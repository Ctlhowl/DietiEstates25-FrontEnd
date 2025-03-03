import { AccountService } from './../../../../../backoffice/src/app/services/account/account.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Offer } from '../../interfaces/offer';
import { OfferService } from '../../services/offer/offer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../serialization/apiResponse';

@Component({
  selector: 'app-history-offer',
  imports: [CommonModule,FormsModule],
  templateUrl: './history-offer.component.html',
  styleUrl: './history-offer.component.css'
})
export class HistoryOfferComponent implements OnChanges{
  @Input() estateId!: number;

  protected offers: Offer[] = []
  newOfferPrice: number | null = null;
  userEmail: string = '';

  constructor(private offerService: OfferService,private accountService: AccountService) {}

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

  public onSave(){
    const confirmOffer = window.confirm('Sei sicuro di voler proseguire con la proposta di '+this.newOfferPrice+'€ ?');
    if (confirmOffer){
      this.accountService.getUserInfo().subscribe(
        {
          next: (response) => {
            this.userEmail = response.data.email;
          },
          error: (error) => {
            console.error("Errore nel recupero delle informazioni dell'utente", error);
          },
          complete: () => {
            const offer : Offer = {
              idEstate: this.estateId,
              price: this.newOfferPrice!, 
              emailUser: this.userEmail,
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
      )
    }
  }
    
}
