import { Network } from 'src/app/enums/networks';

let platformApiOverride: string;
let authApiOverride: string;
let authUiOverride: string;

// platformApiOverride = 'http://localhost:44391/v1';
// authApiOverride = 'http://localhost:44391/v1';
// authUiOverride = 'http://localhost:4200';

export const environment = {
  production: false,
  ga: '',
  defaultTheme: 'light-mode',
  network: Network.Devnet,
  platformApiOverride,
  authApiOverride,
  authUiOverride
};
