import { OpdexErrorStatus } from '@sharedModels/errors/opdex-error';
import { ErrorStatuses, ErrorCode } from '@sharedLookups/error-codes.lookup';

export class ResponseModel<T> {
  data: T;
  error: OpdexErrorStatus;
  hasError: boolean;

  constructor(data?: T, error?: Error) {
    if (error === undefined && data === undefined) {
      const { code } = ErrorStatuses.find(error => error.errorId === ErrorCode.UncaughtException);
      error = new Error(code);
    }

    this.data = data;

    if (error) {
      this.error = new OpdexErrorStatus(error);
    }

    this.hasError = this.error !== undefined;
  }
}
