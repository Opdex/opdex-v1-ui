export interface ITransactionQuoteRequest {
  sender: string;
  to: string;
  amount: string;
  method: string;
  parameters: ITransactionQuoteParameter[];
  callback: string;
}

export interface ITransactionQuoteParameter {
  label: string;
  value: string;
}

export class TransactionQuoteRequest implements ITransactionQuoteRequest {
  private _sender: string;
  private _to: string;
  private _amount: string;
  private _method: string;
  private _parameters: ITransactionQuoteParameter[];
  private _callback: string;

  get payload(): ITransactionQuoteRequest {
    return {
      sender: this._sender,
      to: this._to,
      amount: this._amount,
      method: this._method,
      parameters: this._parameters,
      callback: this._callback
    }
  }

  constructor(request: ITransactionQuoteRequest) {
      this._sender = request.sender;
      this._to = request.to;
      this._amount = request.amount;
      this._method = request.method;
      this._parameters = request.parameters;
      this._callback = request.callback;
  }

  sender: string;
  to: string;
  amount: string;
  method: string;
  parameters: ITransactionQuoteParameter[];
  callback: string;
}
