import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IVaultCertificate } from '@sharedModels/platform-api/responses/vaults/vault-certificate.interface';

export class VaultCertificate {
  private _owner: string;
  private _amount: FixedDecimal;
  private _vestingStartBlock: number;
  private _vestingEndBlock: number;
  private _redeemed: boolean;
  private _revoked: boolean;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get owner(): string {
    return this._owner;
  }

  public get amount(): FixedDecimal {
    return this._amount;
  }

  public get vestingStartBlock(): number {
    return this._vestingStartBlock;
  }

  public get vestingEndBlock(): number {
    return this._vestingEndBlock;
  }

  public get redeemed(): boolean {
    return this._redeemed;
  }

  public get revoked(): boolean {
    return this._revoked;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  public get trackBy(): string {
    const { owner, amount, vestingEndBlock, redeemed, revoked } = this;
    return `${owner}=${amount}-${vestingEndBlock}-${redeemed}-${revoked}`
  }

  constructor(certificate: IVaultCertificate) {
    this._owner = certificate.owner;
    this._amount = new FixedDecimal(certificate.amount, 8);
    this._vestingStartBlock = certificate.vestingStartBlock;
    this._vestingEndBlock = certificate.vestingEndBlock;
    this._redeemed = certificate.redeemed;
    this._revoked = certificate.revoked;
    this._createdBlock = certificate.createdBlock;
    this._modifiedBlock = certificate.modifiedBlock;
  }
}
