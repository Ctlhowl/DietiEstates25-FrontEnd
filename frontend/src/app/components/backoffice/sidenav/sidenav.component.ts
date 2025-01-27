import { Component } from '@angular/core';
import { navbarData } from './nav-data';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  navData = navbarData;
}
