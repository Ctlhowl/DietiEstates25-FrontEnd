import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  protected showPassword: boolean = false;
  
  /**
   * @description Show and hide password 
   */
  protected onShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
