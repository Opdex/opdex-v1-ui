import { Network } from './../app/models/networks';

const api = 'dev-api.opdex.com';
// const api = 'localhost:44391';

export const environment = {
  production: false,
  defaultTheme: 'dark-mode',
  api: api.includes('localhost') ? `http://${api}` : `https://${api}`,
  marketAddress: 'PAXxsvwuwGrJg1XnNCA8Swtpynzj2G8Eca',
  routerAddress: 'PGaYTPL76WjDamtaPvb9k1RVpvTiVcrrkb',
  governanceAddress: 'PDj15HacV6osNfDd5CCU25CMhworu8BjRW',
  allowedJwtDomains: [api],
  network: Network.Devnet
};
