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
  protected isLogged: boolean = false;
  protected navDataUser: NavItem[] = [];
  protected navDataGuest: NavItem[] = [];
  protected isSidebarOpen = false;

  ngOnInit(): void {
    this.isLogged = localStorage.getItem("authToken") != null ? true : false;
    
    this.navDataUser = [
      {
        routeLink: '/estates/my-offers',
        icon: 'notifications',
        label: 'Le mie offerte',
        role: 'user',
      },
      {
        routeLink: '/estates/favorites',
        icon: 'favorite',
        label: 'I miei preferiti',
        role: 'user',
      },
      {
        routeLink: '/profile',
        icon: 'person',
        label: `Profilo`,
        role: 'user',
      },
      {
        routeLink: '/estates',
        icon: 'logout',
        label: `Logout`,
        role: 'user',
      },
    ];

    this.navDataGuest = [
      {
        routeLink: '/login',
        icon: 'person',
        label: 'Accedi',
        role: 'guest',
      }
    ]
  }

  /**
   * @description Open and close the sidebar
   */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * @description Close the sidebar
   */
  closeSidebar() {
    this.isSidebarOpen = false;
  }

  onLogout(){
    const confirmLogout = window.confirm('Sei sicuro di voler effettuare il logout?');
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      window.location.reload();
    } 
  }

}
