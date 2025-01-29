import { IMAGE_CONFIG } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

type NavItem = {
  routeLink: string,
  icon: string,
  label: string,
  role: string
};

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink],
  providers: [
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true, 
        disableImageLazyLoadWarning: true
      }
    },
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit{
  navDataEmployee: NavItem[] = [];
  navDataAdmin: NavItem[] = [];
  userRole: string = 'employee';

  ngOnInit(): void {
    this.navDataEmployee = [
      {
        routeLink: '/',
        icon: 'person',
        label: 'Account',
        role: 'employee',
      },
      {
        routeLink: '/',
        icon: 'home',
        label: 'Inserzioni',
        role: 'employee',
      },
      {
        routeLink: '/',
        icon: 'logout',
        label: 'Logout',
        role: 'employee',
      }
    ];

    this.navDataAdmin = [
      {
        routeLink: '/',
        icon: 'deployed_code_account',
        label: 'Gestione Immobiliare',
        role: 'admin',
      }
    ]
  }
}
