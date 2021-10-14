export interface IRemoveLiquidityRequest {
    liquidity: number;
    amountCrsMin: number;
    amountSrcMin: number;
    recipient: string;
    deadline: number;
    isValid: boolean;
}

export class RemoveLiquidityRequest implements IRemoveLiquidityRequest {
    liquidity: number;
    amountCrsMin: number;
    amountSrcMin: number;
    recipient: string;
    deadline: number;
    isValid: boolean;

    constructor(request: IRemoveLiquidityRequest) {
        if(!request.recipient)
            this.isValid = false;

        this.liquidity = request.liquidity;
        this.amountCrsMin = request.amountCrsMin;
        this.amountSrcMin = request.amountSrcMin;
        this.recipient = request.recipient;
        this.deadline = request.deadline;
    }
}