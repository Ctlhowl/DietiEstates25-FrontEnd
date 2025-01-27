import { Component } from '@angular/core';
import { AppComponent } from "../../../app.component";
import { RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppComponent, RouterOutlet, NgIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
