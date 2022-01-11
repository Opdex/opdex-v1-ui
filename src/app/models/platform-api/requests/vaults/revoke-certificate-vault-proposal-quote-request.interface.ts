export interface IRevokeCertificateVaultProposalQuoteRequest {
  owner: string;
  description: string;
}

export class RevokeCertificateVaultProposalQuoteRequest {
  private _owner: string;
  private _description: string;

  public get payload(): IRevokeCertificateVaultProposalQuoteRequest {
    return {
      owner: this._owner,
      description: this._description
    }
  }

  constructor(owner: string, description: string) {
    this._owner = owner;
    this._description = description;
  }
}
