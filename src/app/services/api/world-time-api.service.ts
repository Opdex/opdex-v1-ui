import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ITImeResponse } from "@sharedModels/world-time-api/time-response.interface";
import { EnvironmentsService } from "@sharedServices/utility/environments.service";
import { ErrorService } from "@sharedServices/utility/error.service";
import { JwtService } from "@sharedServices/utility/jwt.service";
import { UserContextService } from "@sharedServices/utility/user-context.service";
import { Observable } from "rxjs";
import { RestApiService } from "./rest-api.service";

@Injectable({ providedIn: 'root' })
export class WorldTimeApiService extends RestApiService {
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
    this.api = 'https://worldtimeapi.org/api/';
  }

  public getTime(): Observable<ITImeResponse> {
    return this.get<ITImeResponse>(`${this.api}/timezone/Etc/UTC`);
  }
}
