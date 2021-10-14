export interface IApproveAllowanceRequest {
    amount: number;
    spender: string; 
    isValid: boolean;
}

export class ApproveAllowanceRequest implements IApproveAllowanceRequest {
    amount: number;
    spender: string; 
    isValid: boolean;

    constructor(request: IApproveAllowanceRequest) {
        if(!request.spender)
            this.isValid = false;
        
        this.amount = request.amount;
        this.spender = request.spender;
    }
}