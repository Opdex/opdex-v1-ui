export interface IQuoteReplayRequest {
    quote: string;
    isValid: boolean;
}

export class QuoteReplayRequest implements IQuoteReplayRequest {
    quote: string;
    isValid: boolean;

    constructor(request: IQuoteReplayRequest) {
        if(!request.quote) {
            this.isValid = false;
        }

        this.quote = request.quote;
    }
}