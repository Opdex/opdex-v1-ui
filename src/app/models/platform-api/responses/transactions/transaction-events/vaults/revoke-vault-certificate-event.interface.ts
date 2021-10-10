import { ITransactionEvent } from "../transaction-event.interface";

export interface IRevokeVaultCertificateEvent extends ITransactionEvent {
  holder: string;
  oldAmount: string;
  newAmount: string;
  vestedBlock: number;
}
