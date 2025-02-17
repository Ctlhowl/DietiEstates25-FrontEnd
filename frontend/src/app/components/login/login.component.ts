import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.initGoogleLogin();
  }

  login() {
    console.log(this.email);
    console.log(this.password);
    this.loginService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loginService.saveToken(response.data.token);
        console.log('UserID:', this.loginService.getUserId());
        console.log('UserRole:', this.loginService.getUserRole());
      },
      error: () => {
        this.errorMessage = 'Credenziali non valide';
      }
    });
  }

}
