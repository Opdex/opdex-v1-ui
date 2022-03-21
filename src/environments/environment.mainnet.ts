import { Network } from 'src/app/enums/networks';

let apiOverride: string;
let authOverride: string;

// apiOverride = 'http://localhost:44391/v1';
// authOverride = 'http://localhost:4200';

export const environment = {
  production: false,
  ga: '',
  defaultTheme: 'light-mode',
  network: Network.Mainnet,
  apiOverride,
  authOverride
};
