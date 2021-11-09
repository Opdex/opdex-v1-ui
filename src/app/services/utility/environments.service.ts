import { IEnvironment } from '@sharedLookups/environments';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { environments } from '@sharedLookups/environments';
import { Network } from 'src/app/enums/networks';

@Injectable({providedIn: 'root'})
export class EnvironmentsService {
  private _env: IEnvironment;

  public get apiUrl(): string {
    return this._env.apiUrl;
  }

  public get marketAddress(): string {
    return this._env.marketAddress;
  }

  public get routerAddress(): string {
    return this._env.routerAddress;
  }

  public get governanceAddress(): string {
    return this._env.governanceAddress;
  }

  public get vaultAddress(): string {
    return this._env.vaultAddress;
  }

  public get network(): Network {
    return this._env.network;
  }

  constructor() {
    const isDevnet = window.location.href.includes('dev-app');
    const isTestnet = window.location.href.includes('test-app');

    let env: IEnvironment;

    if (!environment.production) {
      env = this._find(environment.networkOverride);
      env.apiUrl = environment.apiOverride;
    }
    else if (isDevnet) env = this._find(Network.Devnet);
    else if (isTestnet) env = this._find(Network.Testnet);
    else env = this._find(Network.Mainnet);

    this._env = {...env};
  }

  private _find(network: Network) {
    return {...environments.find(e => e.network === network)};
  }
}
