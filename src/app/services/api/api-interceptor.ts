import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXJrZXQiOiJhc2Rmc2FkZiIsIndhbGxldCI6ImFzZGZhc2RmIiwibmJmIjoxNjIzMjQ5MTk2LCJleHAiOjE2MjMyNTI3OTYsImlhdCI6MTYyMzI0OTE5Nn0.MkK9EuWNYNBSZwvHK094raFyffEHY2JeBGPrkz2faM8';
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const finalReq = req.clone({
      headers: req.headers.set('Content-Type', 'application/json'),
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(finalReq);
  }
}
