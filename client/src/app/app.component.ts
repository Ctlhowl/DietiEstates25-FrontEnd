import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Dieti-Estate25';

  constructor(private router: Router) { }
  
  get isNavbarVisibile(): boolean {
    return this.router.url === '/login' || this.router.url === '/sign-up';
  }

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage(event: Event) {
    localStorage.removeItem('authToken'); 
  }
}

