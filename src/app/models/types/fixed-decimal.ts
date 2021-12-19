export class FixedDecimal {
  private _originalValue: string;
  private _wholeNumber: string;
  private _fractionNumber: string;
  private _formattedValue: string;
  private _decimals: number;

  public get originalValue(): string
  {
    return this._originalValue;
  }

  public get wholeNumber(): string
  {
    return this._wholeNumber;
  }

  public get fractionNumber(): string
  {
    return this._fractionNumber;
  }

  public get formattedValue(): string
  {
    return this._formattedValue;
  }

  public get decimals(): number
  {
    return this._decimals;
  }

  public get bigInt(): bigint
  {
    return BigInt(this._formattedValue.replace('.', ''));
  }

  public get isZero(): boolean {
    return this._formattedValue.replace(/0/g, '') === '.';
  }

  constructor(value: string, decimals: number) {
    // Todo: Potentially throw
    if (value === null || value === undefined) value = '0';

     // TS/JS suck, strings can still be interpreted as numbers
    value = value.toString().replace(/,/g, '');

    this._originalValue = value;
    this._decimals = decimals;

    if (!value.includes('.')) {
      value = `${value}.`.padEnd(value.length + 1 + decimals, '0');
    }

    if (value.startsWith('.')) {
      value = `0${value}`;
    } else if (value.startsWith('-.')) {
      value = value.replace('-.', '-0.');
    }

    const parts = value.split('.');
    const wholeNumber = parts[0];
    const fractionNumber = parts[1].padEnd(decimals, '0').substr(0, decimals);

    this._wholeNumber = wholeNumber;
    this._fractionNumber = fractionNumber;
    this._formattedValue = `${wholeNumber}.${fractionNumber}`;
  }
}
