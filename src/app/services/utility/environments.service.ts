import { IEnvironment } from '@sharedLookups/environments';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { environments } from '@sharedLookups/environments';
import { Network } from 'src/app/enums/networks';

@Injectable({providedIn: 'root'})
export class EnvironmentsService {
  private _env: IEnvironment;

  public get platformApiUrl(): string {
    return this._env.platformApiUrl;
  }

  public get authApiUrl(): string {
    return this._env.authApiUrl;
  }

  public get authUiUrl(): string {
    return this._env.authUiUrl;
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

  public get authRoute(): string {
    const redirect = `${new URL(window.location.href).origin}/auth`;
    return `${this.authUiUrl}?REDIRECT=${redirect}`;
  }

  constructor() {
    const isDevnet = window.location.href.includes('dev-app');
    const isTestnet = window.location.href.includes('test-app');

    let env: IEnvironment;
    const { production, network, platformApiOverride, authUiOverride, authApiOverride } = environment;

    if (!production) {
      env = this._find(network);
      if (platformApiOverride) env.platformApiUrl = platformApiOverride;
      if (authUiOverride) env.authUiUrl = authUiOverride;
      if (authApiOverride) env.authApiUrl = authApiOverride;
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
