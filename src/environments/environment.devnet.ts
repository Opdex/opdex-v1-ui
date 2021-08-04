import { Network } from "@sharedModels/networks";

const api = 'dev-api.opdex.com';

export const environment = {
  production: true,
  defaultTheme: 'dark-mode',
  api: `https://${api}`,
  marketAddress: 'PAXxsvwuwGrJg1XnNCA8Swtpynzj2G8Eca',
  routerAddress: 'PGaYTPL76WjDamtaPvb9k1RVpvTiVcrrkb',
  governanceAddress: 'PDj15HacV6osNfDd5CCU25CMhworu8BjRW',
  vaultAddress: 'PP7G84rAQVHSwE1fUFykPpBKZ5ZTv3CCHL',
  allowedJwtDomains: [api],
  network: Network.Devnet
};
