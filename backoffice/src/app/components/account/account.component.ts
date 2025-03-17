import { User } from '../../interfaces/user';
import { AccountService } from '../../services/account/account.service';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse } from '../../serialization/apiResponse';

@Component({
  selector: 'app-account',
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  protected user!: User;
  protected form!: FormGroup;
  protected showPassword: boolean = false;
  protected changePassword: boolean = false;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.createForm()
    this.loadUserInfo();
  }

  private createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null)
    });
  }

  private loadForm(user: User): void {
    this.form.get('id')?.setValue(localStorage.getItem("userId"));``
    this.form.get('name')?.setValue(user.name);
    this.form.get('surname')?.setValue(user.surname);
    this.form.get('email')?.setValue(user.email);
    this.form.get('role')?.setValue(user.role);
    this.form.get('provider')?.setValue(user.provider);
  }
  
  private loadUserInfo(): void {     
      this.accountService.getUserInfo().subscribe(
        {
          next: (response: ApiResponse<User>) => {
            this.user = response.data;
          },
          error: (error) => {
            console.error("Errore nel recupero delle informazioni dell'utente", error);
          },
          complete: () => {
            this.loadForm(this.user);
          }
        }
      );
  }

  protected onEditUser(): void {
    document.getElementById('edit-userForm')?.click();
    
    const confirmOffer = window.confirm('Sei sicuro di voler modificare l\'account?');
    if(confirmOffer){
      this.user = this.mapToUser(this.form);

      this.accountService.updateUser(this.user).subscribe(
        {
          complete: () => {
            alert('Account modificato con successo!')
          }
        }
      );
    }
    }
    

  /**
   * @description Show and hide password 
   */
  protected onShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  protected onChangePassword(): void {
    this.changePassword = !this.changePassword;
  }

  protected mapToUser(form: FormGroup): User {
    return {
      id: Number(localStorage.getItem("userId")),
      name: form.get("name")?.value,
      surname: form.get("surname")?.value,
      email: form.get("email")?.value,
      password: this.changePassword ? form.get("password")?.value : this.user.password,
      role: this.user.role,
      provider: this.user.provider,
      agency: this.user.agency
    }
  }
}
