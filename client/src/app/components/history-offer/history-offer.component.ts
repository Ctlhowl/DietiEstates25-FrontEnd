import { Component, Input } from '@angular/core';
import { Offer } from '../../interfaces/offer';

@Component({
  selector: 'app-history-offer',
  imports: [],
  templateUrl: './history-offer.component.html',
  styleUrl: './history-offer.component.css'
})
export class HistoryOfferComponent {
  @Input() estateId!: number;

  protected offers: Offer[] = [
    {
      id: 1,
      price: 1000,
      emailUser: 'emailprova',
      idEstate: 9,
      status: "Nuova Proposta",
      createdAt: "23-02-2025"
    },
    {
      id: 2,
      price: 1002,
      emailUser: 'emailprova',
      idEstate: 9,
      status: "Attesa",
      createdAt: "24-02-2025"
    }
  ];
}
