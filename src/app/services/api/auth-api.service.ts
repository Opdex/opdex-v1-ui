import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { EnvironmentsService } from "@sharedServices/utility/environments.service";
import { ErrorService } from "@sharedServices/utility/error.service";
import { JwtService } from "@sharedServices/utility/jwt.service";
import { UserContextService } from "@sharedServices/utility/user-context.service";
import { Observable } from "rxjs";
import { RestApiService } from "./rest-api.service";

@Injectable({ providedIn: 'root' })
export class AuthApiService extends RestApiService {
  private api: string;

  constructor(
    protected _http: HttpClient,
    protected _error: ErrorService,
    protected _jwt: JwtService,
    protected _router: Router,
    protected _context: UserContextService,
    protected _env: EnvironmentsService
  ) {
    super(_http, _error, _jwt, _context, _router, _env);
    this.api = this._env.authApiUrl;
  }

  public verifyAccessCode(code: string, codeVerifier: string): Observable<string> {
    const endpoint = `${this.api}/auth/token`;
    return this.post<string>(endpoint, {code, codeVerifier}, { responseType: 'text' });
  }
}
