import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Component } from '@angular/core';

@Component({
  selector: 'opdex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private _env: EnvironmentsService) {
    window.location.href = this._env.authRoute;
  }
}
