export interface ISetMarketOwnerQuoteRequest {
  owner: string;
  isValid?: boolean;
}

export class SetMarketOwnerQuoteRequest implements ISetMarketOwnerQuoteRequest {
  owner: string;
  isValid?: boolean = true;

  constructor(request: ISetMarketOwnerQuoteRequest) {
    if(!request.owner)
      this.isValid = false;

    this.owner = request.owner;
  }
}
