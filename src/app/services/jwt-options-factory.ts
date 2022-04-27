import { JwtService } from "./utility/jwt.service";

export function jwtOptionsFactory(jwtService: JwtService) {
  return {
    tokenGetter: () => jwtService.accessToken,
    allowedDomains: [...jwtService.allowedDomains]
  }
}
