export interface IRewindRequest {
    block: number;
    isValid?: boolean;
}

export class RewindRequest implements IRewindRequest {
    block: number;
    isValid?: boolean = true;

    constructor(request: IRewindRequest) {
        if (!request.block)
            this.isValid = false;

        this.block = request.block;
    }
}