import { ITransactionEvent } from "../transaction-event.interface";

export interface ICreateVaultCertificateEvent extends ITransactionEvent {
  holder: string;
  amount: string;
  vestedBlock: number;
}
