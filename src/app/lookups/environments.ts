import { Network } from "../enums/networks";
export interface IEnvironment {
  apiUrl: string;
  marketAddress: string;
  routerAddress: string;
  governanceAddress: string;
  vaultAddress: string;
  network: Network;
}

export const environments: IEnvironment[] = [
  {
    apiUrl: 'https://dev-api.opdex.com',
    marketAddress: 'PWbQLxNnYdyUBLmeEL3ET1WdNx7dvbH8mi',
    routerAddress: 'PMsinMXrr2uNEL5AQD1LpiYTRFiRTA8uZU',
    governanceAddress: 'PGjqKaFDepLNSdakWknucPFB7uXLQGjeCH',
    vaultAddress: 'PHLh9aUdSBS7zke28vnsE4UiVznecFqy9y',
    network: Network.Devnet
  },
  {
    apiUrl: 'https://test-api.opdex.com',
    marketAddress: 't8kAxvbaFzpPTWDE8f2bdgV7V1276xu2VH',
    routerAddress: 't8XpH1pNYDgCnqk91ZQKLgpUVeJ7XmomLT',
    governanceAddress: 'tVfGTqrToiTU9bfnvD5UDC5ZQVY4oj4jrc',
    vaultAddress: 'tS1PEGC4VsovkDgib1MD3eYNv5BL2FAC3i',
    network: Network.Testnet
  },
  {
    apiUrl: 'https://main-api.opdex.com',
    marketAddress: '',
    routerAddress: '',
    governanceAddress: '',
    vaultAddress: '',
    network: Network.Mainnet
  },
]