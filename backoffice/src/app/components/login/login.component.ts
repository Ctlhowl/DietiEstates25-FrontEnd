import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private loginService: LoginService,private router: Router) {}

  login() {
    this.loginService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loginService.saveToken(response.data.token);
        console.log('UserID:', this.loginService.getUserId());
        console.log('UserRole:', this.loginService.getUserRole());

        this.router.navigate(['/estate']);
      },
      error: () => {
        this.errorMessage = 'Credenziali non valide';
      }
    });
  }

}
