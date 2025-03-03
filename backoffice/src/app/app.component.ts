import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidenavComponent } from "./components/sidenav/sidenav.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Dieti-Estate25';

  constructor(private router: Router) { }

  get isNavbarVisibile(): boolean {
    return this.router.url === '/login';
  }

}
