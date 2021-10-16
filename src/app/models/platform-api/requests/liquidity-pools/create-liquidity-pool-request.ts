export interface ICreateLiquidityPoolRequest {
  token: string;
  isValid?: boolean;
}

export class CreateLiquidityPoolRequest implements ICreateLiquidityPoolRequest {
  token: string;
  isValid?: boolean = true;

  constructor(request: ICreateLiquidityPoolRequest) {
    if(!request.token) this.isValid = false;

    this.token = request.token;
  }
}
