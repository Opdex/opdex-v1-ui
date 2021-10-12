import { Network } from '../app/enums/networks';

const api = 'test-api.opdex.com';
// const api = 'localhost:44391';

export const environment = {
  production: false,
  defaultTheme: 'light-mode',
  apiUrl: api.includes('localhost') ? `http://${api}` : `https://${api}`,
  marketAddress: 't8kAxvbaFzpPTWDE8f2bdgV7V1276xu2VH',
  routerAddress: 't8XpH1pNYDgCnqk91ZQKLgpUVeJ7XmomLT',
  governanceAddress: 'tVfGTqrToiTU9bfnvD5UDC5ZQVY4oj4jrc',
  vaultAddress: 'tS1PEGC4VsovkDgib1MD3eYNv5BL2FAC3i',
  network: Network.Testnet,
  ga: ''
};
