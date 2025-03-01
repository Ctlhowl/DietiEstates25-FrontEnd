import { Component, OnInit, ViewChild } from '@angular/core';
import { Estate } from '../../interfaces/estate';
import { EstateService } from '../../services/estate/estate.service';
import { ApiResponse } from '../../serialization/apiResponse';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HistoryOfferComponent } from "../history-offer/history-offer.component";

@Component({
  selector: 'app-estate-list',
  imports: [CommonModule, RouterLink, RouterOutlet, HistoryOfferComponent],
  templateUrl: './estate-list.component.html',
  styleUrl: './estate-list.component.css'
})
export class EstateListComponent implements OnInit {
  @ViewChild(HistoryOfferComponent) historyOfferComponent!: HistoryOfferComponent;
  protected estates: Estate[] = [];
  protected estate?: Estate;
  protected showModal: boolean = false;

  private filter = {
    userId: Number(localStorage.getItem("userId")) ?? 0
  };

  constructor(private estateService: EstateService) {}

  ngOnInit(): void {
    this.setEstate();
  }

  private setEstate(): void {
    this.estateService.getByFilter(this.filter).subscribe(
      {
        next: (response: ApiResponse<Estate[]>) => {
          this.estates = response.data;
        },
        error: (err) => {
          console.error('Errore durante il caricamento delle inserzioni:', err);
        }
      });
  }

  protected openDeleteModal(estate: Estate) {
    this.estate = estate;
  }

  protected deleteEstate(estateId: number | null): void{
    document.getElementById('deleteModal-estate')?.click();

    if (estateId != null) {
      this.estateService.delete(estateId).subscribe(
        {
          complete: () => {
            this.setEstate();
          }
        }
      );
    }
  }

  openModal() {
    console.log("Apro la modale"); // Per debug
    this.showModal = true;
  }

  closeModal() {
    console.log("Chiudo la modale"); // Per debug
    this.showModal = false;
  }

}
