import { Component, OnInit } from '@angular/core';
import { Estate } from '../../interfaces/estate';
import { EstateService } from '../../services/estate/estate.service';
import { ApiResponse } from '../../serialization/apiResponse';

@Component({
  selector: 'app-estate-list',
  imports: [],
  templateUrl: './estate-list.component.html',
  styleUrl: './estate-list.component.css'
})
export class EstateListComponent implements OnInit {
  protected estates: Estate[] = [];
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
        },
      });
  }

}
