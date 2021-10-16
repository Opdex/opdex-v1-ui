export interface IApproveAllowanceRequest {
  amount: string;
  spender: string;
  isValid?: boolean;
}

export class ApproveAllowanceRequest implements IApproveAllowanceRequest {
  amount: string;
  spender: string;
  isValid?: boolean = true;

  constructor(request: IApproveAllowanceRequest) {
    if(!request.spender)
      this.isValid = false;

    this.amount = request.amount;
    this.spender = request.spender;
  }
}
