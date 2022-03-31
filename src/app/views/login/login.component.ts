import { Component } from '@angular/core';
import { AuthService } from '@sharedServices/utility/auth.service';

@Component({
  selector: 'opdex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private _authService: AuthService) {
    this._authService.login();
  }
}
