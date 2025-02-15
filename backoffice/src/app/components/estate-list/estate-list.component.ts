import { Component, OnInit } from '@angular/core';
import { Estate } from '../../interfaces/estate';
import { EstateService } from '../../services/estate/estate.service';
import { ApiResponse } from '../../serialization/apiResponse';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-estate-list',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './estate-list.component.html',
  styleUrl: './estate-list.component.css'
})
export class EstateListComponent implements OnInit {
  protected estates: Estate[] = [];
  protected estate?: Estate;

  private filter = {
    userId: 1
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

}
