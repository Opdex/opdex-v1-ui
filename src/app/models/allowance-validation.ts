import { IAddressAllowanceResponse } from './responses/platform-api/Addresses/address-allowance.interface';

export class AllowanceValidation implements IAddressAllowanceResponse {
  owner: string;
  spender: string;
  token: string;
  allowance: string;
  requestToSpend: string;
  isApproved: boolean;

  constructor(allowanceResponse: IAddressAllowanceResponse, requestToSpend: string) {
    this.owner = allowanceResponse.owner;
    this.spender = allowanceResponse.spender;
    this.token = allowanceResponse.token;
    this.allowance = allowanceResponse.allowance.includes('.') ? allowanceResponse.allowance : "0.00";
    this.requestToSpend = requestToSpend?.toString()?.includes('.') ? requestToSpend : "0.00";

    const requestBigInt = BigInt(this.requestToSpend.toString().replace('.', ''));
    const allowanceBigInt = BigInt(this.allowance.replace('.', ''));

    this.isApproved = requestBigInt <= allowanceBigInt;
  }
}
