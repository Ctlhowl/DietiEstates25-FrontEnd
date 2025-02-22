import { Component, OnInit } from '@angular/core';
import { EstateService } from '../../../services/estate/estate.service';
import { Estate } from '../../../interfaces/estate';
import { ApiResponse } from '../../../serialization/apiResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
  protected estate!: Estate

  constructor(private estateService: EstateService) {}

  ngOnInit(): void {
    this.loadEstateData(9);
  }

  private loadEstateData(id: number) {
    this.estateService.getById(id).subscribe(
      {
        next: (response: ApiResponse<Estate>) => {
          console.log(response);
          this.estate = response.data;
        },
        complete: () => {
          console.log(this.estate);
        },
      }
    );
  }

}
