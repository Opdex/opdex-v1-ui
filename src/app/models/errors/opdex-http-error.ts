export class OpdexHttpError {
  errors: string[];
  status: number;

  constructor(errors: string[], status: number) {
    this.errors = errors;
    this.status = status;
  }
}
