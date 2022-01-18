import { Network } from 'src/app/enums/networks';

// const api = 'http://localhost:44391';
const api = 'https://v1-dev-api.opdex.com';

export const environment = {
  production: false,
  ga: '',
  apiOverride: api,
  networkOverride: Network.Devnet,
  defaultTheme: 'light-mode'
};
