import { ErrorCode, ErrorStatuses } from '@sharedLookups/error-codes.lookup';

export class OpdexError extends Error {
  constructor(errorCode: ErrorCode) {
    super();
    const errorStatus = ErrorStatuses.find(error => error.errorId === errorCode);
    const errorStatusCode = !errorStatus ? errorCode.toString() : errorStatus.code;

    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, OpdexError);
    // }

    this.name = 'OpdexError';
    this.message = errorStatusCode;
  }
}

export class OpdexErrorStatus {
  error: Error;
  code: string;
  message: string;
  title: string;
  errorId: ErrorCode;

  constructor(error: Error) {
    this.code = error.message;
    this.error = error;

    const errorStatus = ErrorStatuses.find(error => error.code === this.code);

    if (errorStatus) {
      this.message = errorStatus.message;
      this.title = errorStatus.title;
      this.errorId = errorStatus.errorId;
    }
  }
}
