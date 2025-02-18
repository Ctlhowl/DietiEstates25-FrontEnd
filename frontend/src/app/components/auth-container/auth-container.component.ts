import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { RegistrationComponent } from "../registration/registration.component";
import { LoginComponent } from "../login/login.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-container',
  imports: [RegistrationComponent, LoginComponent,CommonModule],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.css'
})
export class AuthContainerComponent {
  isRegistering = false;

  constructor(private authService: AuthService) {
    this.authService.isRegistering$.subscribe(value => {
      this.isRegistering = value;
    });
  }
}
