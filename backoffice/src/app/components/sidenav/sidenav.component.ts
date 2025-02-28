import { IMAGE_CONFIG } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

type NavItem = {
  routeLink: string,
  icon: string,
  label: string,
  role: string | null
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
  userRole: string | null = localStorage.getItem('userRole');

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_MANAGER'){
      this.navDataEmployee = [
        {
          routeLink: '/account',
          icon: 'person',
          label: 'Account',
          role: this.userRole,
        },
        {
          routeLink: '/estate',
          icon: 'home',
          label: 'Inserzioni',
          role: this.userRole,
        },
        {
          routeLink: '/employees',
          icon: 'deployed_code_account',
          label: 'Gestione Immobiliare',
          role: this.userRole,
        }
      ];
    }else{
      this.navDataEmployee = [
        {
          routeLink: '/account',
          icon: 'person',
          label: 'Account',
          role: this.userRole,
        },
        {
          routeLink: '/estate',
          icon: 'home',
          label: 'Inserzioni',
          role: this.userRole,
        }
      ]
    }
    
  }

  onLogout(event: Event) {
    this.authService.logout();
  }
}
