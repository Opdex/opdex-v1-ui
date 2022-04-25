export type JWT = {
  wallet: string,
  sub: string,
  nbf: number,
  exp: number,
  iat: number,
  iss: string,
  aud: string
}
