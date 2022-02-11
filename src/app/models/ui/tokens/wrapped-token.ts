import { Icons } from 'src/app/enums/icons';
import { IWrappedToken } from '@sharedModels/platform-api/responses/tokens/token.interface';

export class WrappedToken {
  private _custodian: string;
  private _chain: string;
  private _address: string;
  private _validated: boolean;
  private _trusted: boolean;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get custodian(): string {
    return this._custodian;
  }

  public get chain(): string {
    return this._chain;
  }

  public get address(): string {
    return this._address;
  }

  public get validated(): boolean {
    return this._validated;
  }

  public get trusted(): boolean {
    return this._trusted;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  public get status(): string {
    const trust = this.trusted ? 'Trusted' : 'Untrusted'
    const validated = this.validated ? ' and valid' : ' but invalid';

    return `${trust}${!!this.address ? validated : ''}`;
  }

  public get statusIcon(): string {
    if (this.address) {
      return this.trusted && this.validated ? Icons.check : Icons.warning;
    }

    return this.trusted ? Icons.check : Icons.warning;
  }

  constructor(wrapped: IWrappedToken) {
    this._custodian = wrapped.custodian;
    this._chain = wrapped.chain;
    this._address = wrapped.address;
    this._validated = wrapped.validated;
    this._trusted = wrapped.trusted;
    this._createdBlock = wrapped.createdBlock;
    this._modifiedBlock = wrapped.modifiedBlock;
  }
}
