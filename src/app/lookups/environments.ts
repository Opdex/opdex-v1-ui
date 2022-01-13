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
    marketAddress: 't7RorA7xQCMVYKPM1ibPE1NSswaLbpqLQb',
    routerAddress: 'tAFxpxRdcV9foADqD6gK3c8sY5MeANzFp5',
    miningGovernanceAddress: 'tKFkNiL5KJ3Q4br929i6hHbB4X4mt1MigF',
    vaultAddress: 't7hy4H51KzU6PPCL4QKCdgBGPLV9Jpmf9G',
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
