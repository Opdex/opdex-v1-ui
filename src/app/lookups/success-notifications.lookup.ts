export enum SuccessNotification {
  TransactionComplete
}

export const SuccessNotifications: ISuccessNotification[] = [
  {
    id: SuccessNotification.TransactionComplete,
    title: 'Transaction Complete',
    message: 'Your transaction completed successfully.',
  }
]

export interface ISuccessNotification {
  id: SuccessNotification;
  title: string;
  message: string;
}
