import { User } from '../../interfaces/user';
import { AccountService } from '../../services/account/account.service';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  imports: [CommonModule,FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  user: User = { email: '', name: '', surname: '', role: ''};
  copiedUser: User = { email: '', name: '', surname: '', role: ''};
  isModified: boolean = false;
  showPasswordField = false;
  newPassword = '';

  constructor(private accountService: AccountService) {}

  async ngOnInit() {
    await this.loadUserInfo();
    console.log(this.user); 
  }
  
  async loadUserInfo() {
    try {
      const retrievedUser = await firstValueFrom(this.accountService.getUserInfo());
      this.user = retrievedUser.data;
      this.copiedUser = this.copyUser();
      this.isModified = false;
    } catch (error) {
      console.error("Errore nel recupero delle informazioni dell'utente", error);
    }
  }

  togglePasswordField() {
    this.showPasswordField = true;
  }

  savePassword() {
    this.user.password = this.newPassword;
    this.checkForChanges();
  }

  private copyUser(): User{
    return{
      name: this.user.name,
      surname: this.user.surname,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role
    }
  }

  checkForChanges() {
    if(this.checkModifiedInfo()){
      this.isModified = true;
    }else{
      this.isModified = false;
    }
  }

  private checkModifiedInfo(){
    console.log(this.copiedUser.password)
    if(this.user.name !== this.copiedUser.name){
      return true;
    }
    if(this.user.surname !== this.copiedUser.surname){
      return true;
    }
    if(this.user.email !== this.copiedUser.email){
      return true;
    }
    if(this.user.password !== this.copiedUser.password){
      return true;
    }

    return false
  }

  updateUserInfo() {
    if (this.isModified){
      if (!this.user) return; 

      
      this.accountService.updateUser(this.user).subscribe({
      next: (response) => {
        console.log("User aggiornato con successo!", response);
        this.loadUserInfo(); 
      },
      error: (error) => {
        console.error("Errore nell'aggiornamento dell'utente", error);
      }
      });
    }
    
  }
}
