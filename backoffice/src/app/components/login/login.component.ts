import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  protected form!: FormGroup;
  protected showPassword: boolean = false;
  protected errorMessage?: String;

  constructor(private loginService: LoginService, private router: Router) { }
  
  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
     this.form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.minLength(6)),
      });  
  }

  protected login() {
    this.loginService.login(this.form.value).subscribe({
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
  
  /**
   * @description Show and hide password 
   */
  protected onShowPassword() {
    this.showPassword = !this.showPassword;
  }

}
