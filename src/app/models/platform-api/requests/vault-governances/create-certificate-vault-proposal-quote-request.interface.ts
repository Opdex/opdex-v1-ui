import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

export interface ICreateCertificateVaultProposalQuoteRequest {
  owner: string;
  amount: string;
  description: string;
}

export class CreateCertificateVaultProposalQuoteRequest {
  private _owner: string;
  private _amount: FixedDecimal;
  private _description: string;

  public get payload(): ICreateCertificateVaultProposalQuoteRequest {
    return {
      owner: this._owner,
      amount: this._amount.formattedValue,
      description: this._description
    }
  }

  constructor(owner: string, amount: FixedDecimal, description: string) {
    this._owner = owner;
    this._amount = amount;
    this._description = description;
  }
}
