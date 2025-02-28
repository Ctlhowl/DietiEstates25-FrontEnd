import { User } from './../../interfaces/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeesService } from '../../services/employees/employees.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationService } from '../../services/registration/registration.service';
import { ApiResponse } from '../../serialization/apiResponse';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  protected users: User[] = [];
  protected registerForm!: FormGroup;
  protected showPassword: boolean = false;
  protected availableRoles: string[] = [];

  constructor(
    private employeeService: EmployeesService,
    private spinner: NgxSpinnerService,
    private registrationService: RegistrationService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.createForm();
  }

  private loadData() {
    this.spinner.show();

    this.availableRoles = this.registrationService.getAvailableRoles();

    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        console.log(response)
        this.users = response.data;
      },
      error: (error) => {
        console.error('Errore nel caricamento dei dati' + error);
      },
      complete: () => {
        setTimeout(() => { this.spinner.hide(); }, 400);
      }
    });

  }

  private createForm() {
      this.registerForm = new FormGroup({
        name: new FormControl('', Validators.required),
        surname: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.minLength(6)),
        role: new FormControl('', Validators.required)
      });  
    }
  
    protected onNewEmployee(): void{
      document.getElementById('new-employeeForm')?.click();
      const user: User = this.mapToUser(this.registerForm);
      this.registrationService.register(user).subscribe(
        {
          next: (response: ApiResponse<User>) => {
            this.users.push(response.data);
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
          role: form.get('role')?.value,
          agency: localStorage.getItem('userAgency')
        }
      }
  
    /**
     * @description Show and hide password 
     */
    protected onShowPassword(): void {
      this.showPassword = !this.showPassword;
    }

  protected deleteEmployee(id: number | undefined) {
    if (confirm('Sei sicuro di voler eliminare questo dipendente? '  + id)) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
        },
        error: () => {
          alert('Errore durante l\'eliminazione del dipendente.');
        }
      });
    }
  }
}
