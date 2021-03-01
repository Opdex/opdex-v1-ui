enum ErrorCode {
  UncaughtException = 0
}

interface IErrorStatus {
  message: string;
  code: string;
  title: string;
  errorId: ErrorCode
}

const ErrorStatuses: IErrorStatus[] = [
  {
    message: 'Uh oh, something went wrong...',
    code: 'uncaught-exception',
    title: 'Unexpected Error',
    errorId: ErrorCode.UncaughtException
  }
];

export { ErrorCode, ErrorStatuses }
