import { Network } from 'src/app/enums/networks';

// const api = 'http://localhost:44391';
const api = 'https://test-app.opdex.com';

export const environment = {
  production: false,
  ga: '',
  apiOverride: api,
  networkOverride: Network.Testnet,
  defaultTheme: 'light-mode'
};
