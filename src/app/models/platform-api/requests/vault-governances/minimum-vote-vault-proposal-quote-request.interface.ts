import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface IMinimumVoteVaultProposalQuoteRequest {
  amount: string;
  description: string;
}

export class MinimumVoteVaultProposalQuoteRequest {
  private _amount: FixedDecimal;
  private _description: string;

  public get payload(): IMinimumVoteVaultProposalQuoteRequest {
    return {
      amount: this._amount.formattedValue,
      description: this._description
    }
  }

  constructor(amount: FixedDecimal, description: string) {
    this._amount = amount;
    this._description = description;
  }
}
