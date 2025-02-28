import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../services/registration/registration.service';
import { ApiResponse } from '../../serialization/apiResponse';
import { User } from '../../interfaces/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{
  protected showPassword: boolean = false;
  protected registerForm!: FormGroup;
  protected errorMessage: string = '';

  constructor(private registrationService: RegistrationService, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.minLength(6)),
    });
  }

  onSubmit() {
    document.getElementById('new-employeeForm')?.click();
    
    const user: User = this.mapToUser(this.registerForm);
    this.registrationService.register(user).subscribe(
      {
        next: (response: ApiResponse<User>) => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = 'Errore durante la registrazione';
        }
      }
    );
  }

  protected mapToUser(form: FormGroup): User {
    return {
      name: form.get("name")?.value,
      surname: form.get("surname")?.value,
      email: form.get("email")?.value,
      password: form.get("password")?.value,
      role: 'USER',
    }
  }

  /**
   * @description Show and hide password 
   */
  protected onShowPassword() {
    this.showPassword = !this.showPassword;
  }

}
