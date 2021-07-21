import { Network } from "@sharedModels/networks";

const api = 'api.opdex.com';

export const environment = {
  production: true,
  defaultTheme: 'dark-mode',
  api: `https://${api}`,
  marketAddress: '',
  routerAddress: '',
  governanceAddress: '',
  allowedJwtDomains: [api],
  network: Network.Mainnet
};
