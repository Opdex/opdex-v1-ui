export interface IAddLiquidityRequest {
    amountCrs: number;
    amountSrc: number;
    amountSrcMin: string;
    amountCrsMin: string;
    recipient: string;
    deadline: number;
    isValid?: boolean;
}

export class AddLiquidityRequest implements IAddLiquidityRequest {
    amountCrs: number;
    amountSrc: number;
    amountSrcMin: string;
    amountCrsMin: string;
    recipient: string;
    deadline: number;
    isValid?: boolean = true;

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