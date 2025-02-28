import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  protected form!: FormGroup;
  protected showPassword: boolean = false;
  protected errorMessage?: String;

  constructor(private loginService: LoginService, private router: Router) { }
  
  ngOnInit(): void {
    this.createForm();
    this.renderButton(google);
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

  protected renderButton(google: any): void{
    this.loginService.initGoogleLogin().subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/estate']);
        }
      },
      error: (err) => {
        console.error('Errore nel login Google:', err);
      }
    });;

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { size: "large", shape: "pill" }  
    );
  }

  /**
   * @description Show and hide password 
   */
  protected onShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
