export interface ISwapRequest {
  tokenOut: string;
  tokenInAmount: string;
  tokenOutAmount: string;
  tokenInExactAmount: boolean;
  tokenInMaximumAmount: string;
  tokenOutMinimumAmount: string;
  recipient: string;
  deadline: number;
  isValid?: boolean;
}

export class SwapRequest implements ISwapRequest {
  tokenOut: string;
  tokenInAmount: string;
  tokenOutAmount: string;
  tokenInExactAmount: boolean;
  tokenInMaximumAmount: string;
  tokenOutMinimumAmount: string;
  recipient: string;
  deadline: number;
  isValid?: boolean = true;

  constructor(request: ISwapRequest){
    if (!request.tokenOut || !request.recipient) {
      this.isValid = false;
    }

    this.tokenOut = request.tokenOut;
    this.tokenInAmount = request.tokenInAmount;
    this.tokenOutAmount = request.tokenOutAmount;
    this.tokenInExactAmount = request.tokenInExactAmount;
    this.tokenInMaximumAmount = request.tokenInMaximumAmount;
    this.tokenOutMinimumAmount = request.tokenOutMinimumAmount;
    this.recipient = request.recipient;
    this.deadline = request.deadline;
  }
}
