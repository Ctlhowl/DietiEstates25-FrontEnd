import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { Estate } from '../../interfaces/estate';
import { EstateService } from '../../services/estate/estate.service';
import { ApiResponse } from '../../serialization/apiResponse';


@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterLink, FilterComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  @ViewChild(FilterComponent) filterComponent!: FilterComponent;

  protected estates: Estate[] = [];
  protected estate?: Estate;
  protected iconName: string = 'favorite_border';

  private filter = {
    userId: 2
  };

  constructor(private estateService: EstateService) { }
  
  ngOnInit(): void {
    this.loadEstates();
  }

  /**
   * @description Load estate data
   */
  private loadEstates(): void {
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


  /**
   * @description Check if the estate has been added to favorites
   */
  get isFavorite(): boolean {
    return true;
  }
}
