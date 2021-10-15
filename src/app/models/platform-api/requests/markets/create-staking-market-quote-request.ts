export interface ICreateStakingMarketQuoteRequest {
    stakingToken: string;
    isValid?: boolean;
}

export class CreateStakingMarketQuoteRequest implements ICreateStakingMarketQuoteRequest {
    stakingToken: string;
    isValid?: boolean = true;

    constructor(request: ICreateStakingMarketQuoteRequest) {
        if(!request.stakingToken)
            this.isValid = false;

        this.stakingToken = request.stakingToken;
    }
}