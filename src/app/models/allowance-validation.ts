import { IToken } from './platform-api/responses/tokens/token.interface';
import { IAddressAllowanceResponse } from './platform-api/responses/wallets/address-allowance.interface';

export class AllowanceValidation {
  owner: string;
  spender: string;
  token: IToken;
  allowance: string;
  requestToSpend: string;
  isApproved: boolean;

  constructor(allowanceResponse: IAddressAllowanceResponse, requestToSpend: string, token: IToken) {
    this.owner = allowanceResponse.owner;
    this.spender = allowanceResponse.spender;
    this.allowance = allowanceResponse.allowance;
    this.requestToSpend = requestToSpend;
    this.token = token;

    this.isApproved = this.validate(token.decimals)
  }

  private validate(tokenDecimals) :boolean {
    // Sometimes javascript considers the request to spend string a number, call toString and get rid of any commas
    const spendRequest = this.requestToSpend.toString().replace(/,/g, '');

    // Get the index of the decimal
    const spendRequestDecimalIndex = spendRequest.indexOf('.');

    // Using the index of the decimal and how many decimals the token has, find the number of 0's to pad the end with
    const spendRequestZerosToPad = tokenDecimals - (spendRequest.length - (spendRequestDecimalIndex + 1)); // + 1 because index starts at 0

    let requestBigInt: BigInt;

    // Need to pad the end with 0's
    if (spendRequestZerosToPad >= 0) {
      // - 1 at the end because we're remove the decimal and padding
      requestBigInt = BigInt(spendRequest.replace('.', '').padEnd(spendRequest.length + spendRequestZerosToPad - 1, '0'));
    } else { // Need to cut the end
      requestBigInt = BigInt(spendRequest.replace('.', '').slice(0, spendRequestZerosToPad));
    }

    // Allowance always returns the full decimals like 0.00000000, remove the decimal
    const allowanceBigInt = BigInt(this.allowance.replace('.', ''));

    return requestBigInt <= allowanceBigInt;
  }
}
