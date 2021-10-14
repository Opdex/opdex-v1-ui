export interface IRevokeVaultCertificatesQuoteRequest {
    holder: string;
    isValid: boolean;
}

export class RevokeVaultCertificatesQuoteRequest implements IRevokeVaultCertificatesQuoteRequest{
    holder: string;
    isValid: boolean;

    constructor(request: IRevokeVaultCertificatesQuoteRequest){
        if(!request.holder)
            this.isValid = false;

        this.holder = request.holder;
    }
}