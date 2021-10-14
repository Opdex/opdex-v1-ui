export interface IAddTokenRequest {
    tokenAddress: string;
    isValid: boolean;
}

export class AddTokenRequest implements IAddTokenRequest {
    tokenAddress: string;
    isValid: boolean;

    constructor(request: IAddTokenRequest) {
        if(!request.tokenAddress)
            this.isValid = true;

        this.tokenAddress = request.tokenAddress;
    }
}
