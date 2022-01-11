import { Network } from "../enums/networks";

export interface IEnvironment {
  apiUrl: string;
  marketAddress: string;
  routerAddress: string;
  miningGovernanceAddress: string;
  vaultAddress: string;
  network: Network;
}

export const environments: IEnvironment[] = [
  {
    apiUrl: 'https://dev-api.opdex.com',
    marketAddress: 'PXToW7DpAhVAYn9Ye3TLs91jV22NqLmHWx',
    routerAddress: 'PNzmDwtPNt5EYukJZzjShsHHrjpe2y594x',
    miningGovernanceAddress: 'PHrY3DUj6DgjKZq2aWdwGiKs5FAWoy2QS2',
    vaultAddress: 'P9nNJ4Jszz2VtgGoPidY7NKvha11mvyGpp',
    network: Network.Devnet
  },
  {
    apiUrl: 'https://test-api.opdex.com',
    marketAddress: 't8kAxvbaFzpPTWDE8f2bdgV7V1276xu2VH',
    routerAddress: 't8XpH1pNYDgCnqk91ZQKLgpUVeJ7XmomLT',
    miningGovernanceAddress: 'tVfGTqrToiTU9bfnvD5UDC5ZQVY4oj4jrc',
    vaultAddress: '',
    network: Network.Testnet
  },
  {
    apiUrl: 'https://main-api.opdex.com',
    marketAddress: '',
    routerAddress: '',
    miningGovernanceAddress: '',
    vaultAddress: '',
    network: Network.Mainnet
  }
]
