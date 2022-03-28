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

  public get authUrl(): string {
    return this._env.authUrl;
  }

  public get marketAddress(): string {
    return this._env.marketAddress;
  }

  public get routerAddress(): string {
    return this._env.routerAddress;
  }

  public get miningGovernanceAddress(): string {
    return this._env.miningGovernanceAddress;
  }

  public get vaultAddress(): string {
    return this._env.vaultAddress;
  }

  public get network(): Network {
    return this._env.network;
  }

  public get useNewAuthFlow(): boolean {
    return this.network === Network.Devnet ? true : false;
  }

  constructor() {
    const isDevnet = window.location.href.includes('dev-app');
    const isTestnet = window.location.href.includes('test-app');

    let env: IEnvironment;
    const { production, network, apiOverride, authOverride } = environment;

    if (!production) {
      env = this._find(network);
      if (apiOverride) env.apiUrl = apiOverride;
      if (authOverride) env.authUrl = authOverride;
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
