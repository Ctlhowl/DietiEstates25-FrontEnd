import { IMAGE_CONFIG } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type NavItem = {
  routeLink: string,
  icon: string,
  label: string,
  role: string
};


@Component({
  selector: 'app-navbar',
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

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navDataUser: NavItem[] = [];
  navDataGuest: NavItem[] = [];
  userRole: string = "user";

  ngOnInit(): void {
    this.navDataUser = [
      {
        routeLink: '/favorite-estate',
        icon: 'favorite',
        label: 'I miei preferiti',
        role: 'user',
      },
      {
        routeLink: '/history',
        icon: 'notifications',
        label: 'Le mie offerte',
        role: 'user',
      },
      {
        routeLink: '/profile',
        icon: 'person',
        label: `Profilo`,
        role: 'user',
      },
    ];

    this.navDataGuest = [
      {
        routeLink: '/',
        icon: 'person',
        label: 'Accedi',
        role: 'guest',
      }
    ]
  }

}
