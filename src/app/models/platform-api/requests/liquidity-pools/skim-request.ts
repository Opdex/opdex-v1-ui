export interface ISkimRequest {
  recipient: string;
}

export class SkimRequest {
  private _recipient: string;

  public get payload(): ISkimRequest {
    return {
      recipient: this._recipient
    }
  }

  constructor(recipient: string){
    this._recipient = recipient;
  }
}
