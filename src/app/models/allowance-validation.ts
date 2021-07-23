import { IAddressAllowanceResponse } from './responses/platform-api/Addresses/address-allowance.interface';

export class AllowanceValidation implements IAddressAllowanceResponse {
  owner: string;
  spender: string;
  token: string;
  allowance: string;
  requestToSpend: string;
  isApproved: boolean;

  constructor(allowanceResponse: IAddressAllowanceResponse, requestToSpend: string, tokenDecimals: number) {
    this.owner = allowanceResponse.owner;
    this.spender = allowanceResponse.spender;
    this.token = allowanceResponse.token;
    this.allowance = allowanceResponse.allowance;
    this.requestToSpend = requestToSpend;


    this.isApproved = this.validate(tokenDecimals)
  }

  private validate(tokenDecimals) :boolean {
    // Sometimes javascript considers the request to spend string a number, call toString
    const spendRequest = this.requestToSpend.toString();

    // Get the index of the decimal
    const spendRequestDecimalIndex = spendRequest.indexOf('.');

    // Using the index of the decimal and how many decimals the token has, find the number of 0's to pad the end with
    const spendRequestZerosToPad = tokenDecimals - (spendRequest.length - (spendRequestDecimalIndex + 1)); // + 1 because index starts at 0

    let requestBigInt: BigInt;

    // Need to pad the end with 0's
    if (spendRequestZerosToPad >= 0) {
      // Create a big integer, replacing the decimal place and subtracting -1 from the end because of the removed decimal.
      requestBigInt = BigInt(spendRequest.replace('.', '').padEnd(this.requestToSpend.length + spendRequestZerosToPad - 1, "0"));
    } else { // Need to cut the end
      requestBigInt = BigInt(spendRequest.replace('.', '').slice(0, spendRequestZerosToPad));
    }

    // Allowance always returns the full decimals like 0.00000000, remove the decimal
    const allowanceBigInt = BigInt(this.allowance.replace('.', ''));

    return requestBigInt <= allowanceBigInt;
  }
}
