export interface ISkimRequest {
  recipient: string;
  isValid?: boolean;
}

export class SkimRequest implements ISkimRequest{
  recipient: string;
  isValid?: boolean = true;

  constructor(request: ISkimRequest){
    if(!request.recipient)
      this.isValid;

    this.recipient = request.recipient;
  }
}
