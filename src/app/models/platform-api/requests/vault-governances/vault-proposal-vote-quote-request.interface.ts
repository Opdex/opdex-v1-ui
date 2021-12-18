import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface IVaultProposalVoteQuoteRequest {
  amount: string;
  inFavor: boolean;
}

export class VaultProposalVoteQuoteRequest {
  private _amount: FixedDecimal;
  private _inFavor: boolean;

  public get payload(): IVaultProposalVoteQuoteRequest {
    return {
      amount: this._amount.formattedValue,
      inFavor: this._inFavor
    }
  }

  constructor(amount: FixedDecimal, inFavor: boolean) {
    this._amount = amount;
    this._inFavor = inFavor;
  }
}
