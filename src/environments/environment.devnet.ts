import { Network } from "@sharedModels/networks";

const api = 'dev-api.opdex.com';

export const environment = {
  production: true,
  defaultTheme: 'dark-mode',
  api: `https://${api}`,
  marketAddress: '',
  allowedJwtDomains: [api],
  network: Network.Devnet
};
