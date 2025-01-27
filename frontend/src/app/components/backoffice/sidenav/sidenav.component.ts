import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

export type NavItem = {
  routeLink: string,
  icon: string,
  label: string
};

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit{
  navData: NavItem[] = [];

  ngOnInit(): void {
    this.navData = [
      {
          routeLink: '/',
          icon: 'person',
          label: 'Account'
      },
      {
          routeLink: '/',
          icon: 'home',
          label: 'Inserzioni'
      },
      {
          routeLink: '/',
          icon: 'deployed_code_account',
          label: 'Gestione Immobiliare'
      },
      {
          routeLink: '/',
          icon: 'logout',
          label: 'Logout'
      }
    ];
  }
}
