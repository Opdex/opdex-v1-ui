import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface IVaultProposalWithdrawVoteQuoteRequest {
  amount: string;
}

export class VaultProposalWithdrawVoteQuoteRequest {
  private _amount: FixedDecimal;

  public get payload(): IVaultProposalWithdrawVoteQuoteRequest {
    return {
      amount: this._amount.formattedValue,
    }
  }

  constructor(amount: FixedDecimal) {
    this._amount = amount;
  }
}
