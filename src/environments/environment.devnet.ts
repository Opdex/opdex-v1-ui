import { Network } from "src/app/enums/networks";

const api = 'dev-api.opdex.com';

export const environment = {
  production: true,
  defaultTheme: 'dark-mode',
  api: `https://${api}`,
  marketAddress: 'PWbQLxNnYdyUBLmeEL3ET1WdNx7dvbH8mi',
  routerAddress: 'PMsinMXrr2uNEL5AQD1LpiYTRFiRTA8uZU',
  governanceAddress: 'PGjqKaFDepLNSdakWknucPFB7uXLQGjeCH',
  vaultAddress: 'PHLh9aUdSBS7zke28vnsE4UiVznecFqy9y',
  allowedJwtDomains: [api],
  network: Network.Devnet
};
