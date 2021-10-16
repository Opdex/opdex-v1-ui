export interface ISetVaultOwnerQuoteRequest {
  owner: string;
  isValid?: boolean;
}

export class SetVaultOwnerQuoteRequest implements ISetVaultOwnerQuoteRequest {
  owner: string;
  isValid?: boolean = true;

  constructor(request: ISetVaultOwnerQuoteRequest){
    if(!request.owner) this.isValid = false;

    this.owner = request.owner;
  }
}
