import { Network } from './../app/models/networks';

const api = 'localhost:44391';

export const environment = {
  production: false,
  defaultTheme: 'dark-mode',
  api: `http://${api}`,
  marketAddress: 'PGbdqSqwcyBJPt2UAb9WauPmu8z4rc78eT',
  allowedJwtDomains: [api],
  network: Network.Devnet
};
