import { IApprovalEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/tokens/approve-event.interface';
import { IToken } from './platform-api/responses/tokens/token.interface';
import { IAddressAllowanceResponse } from './platform-api/responses/wallets/address-allowance.interface';
import { FixedDecimal } from './types/fixed-decimal';

export class AllowanceValidation {
  owner: string;
  spender: string;
  token: IToken;
  allowance: FixedDecimal;
  requestToSpend: FixedDecimal;
  isApproved: boolean;

  constructor(allowanceResponse: IAddressAllowanceResponse, requestToSpend: string, token: IToken) {
    this.owner = allowanceResponse.owner;
    this.spender = allowanceResponse.spender;
    this.allowance = new FixedDecimal(allowanceResponse.allowance, token.decimals);
    this.requestToSpend = new FixedDecimal(requestToSpend, token.decimals);
    this.token = token;
    this.isApproved = this.requestToSpend.bigInt <= this.allowance.bigInt;
  }

  update(event: IApprovalEvent) {
    this.allowance = new FixedDecimal(event.amount, this.token.decimals);
    this.isApproved = this.requestToSpend.bigInt <= this.allowance.bigInt;
  }
}
