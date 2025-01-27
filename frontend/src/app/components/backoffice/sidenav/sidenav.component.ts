import { Component } from '@angular/core';
import { navbarData } from './nav-data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  collapsed = false;
  navData = navbarData;
}
