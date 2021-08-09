import { Network } from './../app/models/networks';

const api = 'dev-api.opdex.com';
// const api = 'localhost:44391';

export const environment = {
  production: false,
  defaultTheme: 'dark-mode',
  api: api.includes('localhost') ? `http://${api}` : `https://${api}`,
  marketAddress: 'PWbQLxNnYdyUBLmeEL3ET1WdNx7dvbH8mi',
  routerAddress: 'PMsinMXrr2uNEL5AQD1LpiYTRFiRTA8uZU',
  governanceAddress: 'PGjqKaFDepLNSdakWknucPFB7uXLQGjeCH',
  vaultAddress: 'PHLh9aUdSBS7zke28vnsE4UiVznecFqy9y',
  allowedJwtDomains: [api],
  network: Network.Devnet
};
