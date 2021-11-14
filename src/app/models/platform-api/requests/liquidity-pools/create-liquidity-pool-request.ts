export interface ICreateLiquidityPoolRequest {
  token: string;
  market: string;
  isValid?: boolean;
}

export class CreateLiquidityPoolRequest implements ICreateLiquidityPoolRequest {
  token: string;
  market: string;
  isValid?: boolean = true;

  constructor(request: ICreateLiquidityPoolRequest) {
    if(!request.token) this.isValid = false;

    this.token = request.token;
  }
}
