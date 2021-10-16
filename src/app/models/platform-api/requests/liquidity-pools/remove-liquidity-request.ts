export interface IRemoveLiquidityRequest {
  liquidity: string;
  amountCrsMin: string;
  amountSrcMin: string;
  liquidityPool: string;
  recipient: string;
  deadline: number;
  isValid?: boolean;
}

export class RemoveLiquidityRequest implements IRemoveLiquidityRequest {
  liquidity: string;
  amountCrsMin: string;
  amountSrcMin: string;
  liquidityPool: string;
  recipient: string;
  deadline: number;
  isValid?: boolean = true;

  constructor(request: IRemoveLiquidityRequest) {
    if(!request.recipient)
      this.isValid = false;

    this.liquidity = request.liquidity;
    this.amountCrsMin = request.amountCrsMin;
    this.amountSrcMin = request.amountSrcMin;
    this.liquidityPool = request.liquidityPool
    this.recipient = request.recipient;
    this.deadline = request.deadline;
  }
}
