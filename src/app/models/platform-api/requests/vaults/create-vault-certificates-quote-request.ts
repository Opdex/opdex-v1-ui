export interface ICreateVaultCertificateQuoteRequest {
  holder: string;
  amount: string;
  isValid?: boolean;
}

export class CreateVaultCertificateQuoteRequest implements ICreateVaultCertificateQuoteRequest {
  holder: string;
  amount: string;
  isValid?: boolean = true;

  constructor(request: ICreateVaultCertificateQuoteRequest) {
    if(!request.holder)
      this.isValid = false;

    this.holder = request.holder;
    this.amount = request.amount;
  }
}
