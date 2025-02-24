import { Component } from '@angular/core';
import { RegistrationService } from '../../services/registration/registration.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder,private registrationService: RegistrationService,private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user = {
        name: this.registerForm.get('name')?.value, 
        surname: this.registerForm.get('surname')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        role: 'USER'
      };

      this.registrationService.register(user).subscribe({
        next: (response) => {
          this.successMessage = 'Registrazione avvenuta con successo!'+' '+response.data.name+' Benvenuto in DietiEstates25';
          this.goToLogin();
        },
        error: (error) => {
          this.errorMessage = 'Errore durante la registrazione';
        }
      });
    }
  }

  goToLogin(){
    this.router.navigate(['']);
  }
}
