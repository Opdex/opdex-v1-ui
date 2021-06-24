import { WalletService } from './../wallet.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private _wallet: WalletService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this._wallet.getToken();
    let finalReq = req;

    // Todo: If a token is not found, we must get one to use the api and will return text token response,
    // Clean this up, every API request should not need to pass through this.
    if (!token) {
      finalReq = req.clone({
        headers: req.headers.set('Content-Type', 'application/json'),
        responseType: 'text'
      });
    }

    return next.handle(finalReq);
  }
}
