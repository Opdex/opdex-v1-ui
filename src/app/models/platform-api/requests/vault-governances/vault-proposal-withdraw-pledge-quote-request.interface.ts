import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface IVaultProposalWithdrawPledgeQuoteRequest {
  amount: string;
}

export class VaultProposalWithdrawPledgeQuoteRequest {
  private _amount: FixedDecimal;

  public get payload(): IVaultProposalWithdrawPledgeQuoteRequest {
    return {
      amount: this._amount.formattedValue,
    }
  }

  constructor(amount: FixedDecimal) {
    this._amount = amount;
  }
}
