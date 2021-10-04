import { Injectable } from '@angular/core';

export interface IMoney {
  decimals: number;
  value: bigint;
}

@Injectable({ providedIn: 'root' })
export class MathService {

  /**
   * @summary Multiplies a decimal number as a string by a general typescript number.
   * @param a decimal number as string
   * @param b safe number
   * @returns decimal number as a string
   */
  multiply(a: string, b: number) {
    if (a === null || a === undefined) {
      return '0';
    }

    // A must be decimal as string
    if (!a.includes('.')) {
      throw "Invalid decimal number."
    }

    // Todo: Validate A is a valid decimal number using regex

    // Count how many A decimals
    const aDecimals = a.toString().length - (a.toString().indexOf('.') + 1);

    // Cut decimal, convert to bigint
    const aBigInt = BigInt(a.replace('.', ''));

    // Count how many B decimals
    const bDecimals = b.toString().length - (b.toString().indexOf('.') + 1);

    // Cut decimal, convert to bigint
    const bBigInt = BigInt(b.toString().replace('.', ''));

    // Multiply
    const product = aBigInt * bBigInt;

    if (product === BigInt(0)) return '0';

    // Cut the string off at the precision point, no rounding is implemented.
    const productRoundedLength = product.toString().length - (aDecimals + bDecimals);

    // whole numbers
    const whole = product.toString().substring(0, productRoundedLength) || '0';

    // remainder (decimal)
    const remainder = product.toString().substring(productRoundedLength).padStart(aDecimals + bDecimals, '0');

    // Using A and B Decimals, convert result
    const total = `${whole}.${remainder}`;

    // round
    return total.substring(0, whole.length + 1 + aDecimals)
  }

  subtract(a: string, b: string): string {
    // Count how many A decimals
    const aDecimals = a.toString().length - (a.toString().indexOf('.') + 1);

    // Cut decimal, convert to bigint
    const aBigInt = BigInt(a.replace('.', ''));

    // Count how many B decimals
    const bDecimals = b.toString().length - (b.toString().indexOf('.') + 1);

    // Cut decimal, convert to bigint
    const bBigInt = BigInt(b.toString().replace('.', ''));

    // Subtract
    const result = aBigInt - bBigInt;

    const resultRoundedLength = result.toString().length - (aDecimals);

    // whole numbers
    const whole = result.toString().substring(0, resultRoundedLength) || '0';

    // remainder (decimal)
    const remainder = result.toString().substring(resultRoundedLength).padStart(aDecimals, '0');

    // Using A and B Decimals, convert result
    const total = `${whole}.${remainder}`;

    return total;
  }
}
