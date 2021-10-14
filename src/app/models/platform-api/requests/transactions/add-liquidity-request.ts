export interface IAddLiquidityRequest {
    amountCrs: number;
    amountSrc: number;
    amountSrcMin: number;
    amountCrsMin: number;
    recipient: string;
    deadline: number;
    isValid: boolean;
}

export class AddLiquidityRequest implements IAddLiquidityRequest {
    amountCrs: number;
    amountSrc: number;
    amountSrcMin: number;
    amountCrsMin: number;
    recipient: string;
    deadline: number;
    isValid: boolean;

    constructor(request: IAddLiquidityRequest) {
        if(!request.recipient) {
            this.isValid = false;
        }
        
        this.amountCrs = request.amountCrs;
        this.amountSrc = request.amountSrc;
        this.amountSrcMin = request.amountSrcMin;
        this.amountCrsMin = request.amountCrsMin;
        this.recipient = request.recipient;
        this.deadline = request.deadline;
    }
}