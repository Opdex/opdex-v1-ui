import { Network } from './../app/models/networks';

// const api = 'dev-api.opdex.com';
const api = 'localhost:44391';

export const environment = {
  production: false,
  defaultTheme: 'dark-mode',
  api: api.includes('localhost') ? `http://${api}` : `https://${api}`,
  marketAddress: 'PLSU8Dq8QuPSDzJspQzKqn4kFgmP2UZgP6',
  routerAddress: 'PBaCTtHCRDRnT4uwZ9XtXrUSToMTxD9qGq',
  governanceAddress: 'PFXdo7w8czyQLCkTJZzWnj2JdE2yap6HaX',
  vaultAddress: 'PKzdt4bFYUh3c9mPstGTAqqVG16jFFwAdv',
  allowedJwtDomains: [api],
  network: Network.Devnet
};
