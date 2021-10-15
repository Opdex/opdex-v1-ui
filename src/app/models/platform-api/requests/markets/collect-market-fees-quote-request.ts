export interface ICollectMarketFeesQuoteRequest {
    token: string;
    amount: number;
    isValid?: boolean;
}

export class CollectMarketFeesQuoteRequest implements ICollectMarketFeesQuoteRequest {
     token: string;
     amount: number;
     isValid?: boolean = true;

     constructor(request: ICollectMarketFeesQuoteRequest){
        if (!request.amount || !request.token)
            this.isValid = false;
        
        this.token = request.token;
        this.amount = request.amount;
     }
}