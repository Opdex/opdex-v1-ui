import { Network } from "../enums/networks";

export interface IEnvironment {
  platformApiUrl: string;
  authUiUrl: string;
  authApiUrl: string;
  marketAddress: string;
  routerAddress: string;
  miningGovernanceAddress: string;
  vaultAddress: string;
  network: Network;
}

export const environments: IEnvironment[] = [
  // Local Environment
  // {
  //   platformApiUrl: 'http://localhost:44391/v1',
  //   authUiUrl: 'https://dev-auth.opdex.com',
  //   authApiUrl: 'https://dev-auth-api.opdex.com/v1',
  //   marketAddress: 'PTfHL6rJT4doifQAoBdufdCA5DTdVi3cde',
  //   routerAddress: 'P8pL7bEynLesHE7qy9RtmEqdJKkAcNYFNj',
  //   miningGovernanceAddress: 'PFE5wzqXybHp2PeoWRXtqC2G11tnBuVZoR',
  //   vaultAddress: 'P9bsANxnUB9AjFhEBCb9ev89DkskxoSbFH',
  //   network: Network.Devnet
  // },
  // Devnet Environment
  {
    platformApiUrl: 'https://v1-dev-api.opdex.com/v1',
    authApiUrl: 'https://dev-auth-api.opdex.com/v1',
    authUiUrl: 'https://dev-auth.opdex.com',
    marketAddress: 'PXToW7DpAhVAYn9Ye3TLs91jV22NqLmHWx',
    routerAddress: 'PNzmDwtPNt5EYukJZzjShsHHrjpe2y594x',
    miningGovernanceAddress: 'PHrY3DUj6DgjKZq2aWdwGiKs5FAWoy2QS2',
    vaultAddress: 'P9nNJ4Jszz2VtgGoPidY7NKvha11mvyGpp',
    network: Network.Devnet
  },
  // Testnet Environment
  {
    platformApiUrl: 'https://v1-test-api.opdex.com/v1',
    authApiUrl: 'https://test-auth-api.opdex.com/v1',
    authUiUrl: 'https://test-auth.opdex.com',
    marketAddress: 't7RorA7xQCMVYKPM1ibPE1NSswaLbpqLQb',
    routerAddress: 'tAFxpxRdcV9foADqD6gK3c8sY5MeANzFp5',
    miningGovernanceAddress: 'tKFkNiL5KJ3Q4br929i6hHbB4X4mt1MigF',
    vaultAddress: 't7hy4H51KzU6PPCL4QKCdgBGPLV9Jpmf9G',
    network: Network.Testnet
  },
  // Mainnet Environment
  {
    platformApiUrl: 'https://v1-api.opdex.com/v1',
    authApiUrl: 'https://auth-api.opdex.com/v1',
    authUiUrl: 'https://auth.opdex.com',
    marketAddress: 'CGmbx89aJdVtFGEUMZfdbRntYkGJgwjUrv',
    routerAddress: 'CeNa4b95h9YqDc1UZ2YCqmeqXXKqeDdAYW',
    miningGovernanceAddress: 'CYrKKCyrq816j4nXS1k1cuXagEJWmmjdup',
    vaultAddress: 'CTzsaNA1yTQwD3YNkZkJQbwupczAnaVW6Q',
    network: Network.Mainnet
  }
]
