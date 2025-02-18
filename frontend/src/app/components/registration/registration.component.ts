import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../services/registration/registration.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  availableRoles: string[] = [];

  constructor(private fb: FormBuilder,private registrationService: RegistrationService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.availableRoles = this.registrationService.getAvailableRoles();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user = {
        name: this.registerForm.get('name')?.value, 
        surname: this.registerForm.get('surname')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        role: this.registerForm.get('role')?.value
      };

      this.registrationService.register(user).subscribe({
        next: (response) => {
          this.successMessage = 'Registrazione avvenuta con successo!';
        },
        error: (error) => {
          this.errorMessage = 'Errore durante la registrazione';
        }
      });
    }
  }

  /*goToLogin(){
    this.authService.switchToLogin();
  }*/
}
