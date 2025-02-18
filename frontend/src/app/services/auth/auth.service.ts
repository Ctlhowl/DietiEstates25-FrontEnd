import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isRegistering = new BehaviorSubject<boolean>(false);
  isRegistering$ = this.isRegistering.asObservable();

  switchToRegister() {
    this.isRegistering.next(true);
  }

  switchToLogin() {
    this.isRegistering.next(false);
  }
}
