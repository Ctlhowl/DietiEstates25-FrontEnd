import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  protected showPassword: boolean = false;
  
  /**
   * @description Show and hide password 
   */
  protected onShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
