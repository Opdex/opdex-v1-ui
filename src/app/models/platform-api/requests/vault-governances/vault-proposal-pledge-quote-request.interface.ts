import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface IVaultProposalPledgeQuoteRequest {
  amount: string;
}

export class VaultProposalPledgeQuoteRequest {
  private _amount: FixedDecimal;

  public get payload(): IVaultProposalPledgeQuoteRequest {
    return {
      amount: this._amount.formattedValue,
    }
  }

  constructor(amount: FixedDecimal) {
    this._amount = amount;
  }
}
