import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  protected showPassword: boolean = false;
  
  /**
   * @description Show and hide password 
   */
  protected onShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
