import { ITransactionEvent } from "../transaction-event.interface";

export interface IRedeemVaultCertificateEvent extends ITransactionEvent {
  holder: string;
  amount: string;
  vestedBlock: number;
}
