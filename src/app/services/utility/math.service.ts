import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MathService {
  static multiply(a: FixedDecimal, b: FixedDecimal) {
    if (!a || !b) return '0';

    const product = a.bigInt * b.bigInt;

    if (product === BigInt(0)) return '0';

    // Cut the string off at the precision point, no rounding is implemented.
    const productRoundedLength = product.toString().length - (a.decimals + b.decimals);

    // whole numbers
    const whole = product.toString().substring(0, productRoundedLength) || '0';

    // remainder (decimal)
    const remainder = product.toString().substring(productRoundedLength).padStart(a.decimals + b.decimals, '0');

    // Using A and B Decimals, convert result
    const total = `${whole}.${remainder}`;

    // round
    return total.substring(0, whole.length + 1 + a.decimals)
  }

  static subtract(a: FixedDecimal, b: FixedDecimal) {
    if (!a || !b) return '0';

    // Subtract
    const result = a.bigInt - b.bigInt;

    const resultRoundedLength = result.toString().length - (a.decimals);

    // whole numbers
    const whole = result.toString().substring(0, resultRoundedLength) || '0';

    // remainder (decimal)
    const remainder = result.toString().substring(resultRoundedLength).padStart(a.decimals, '0');

    // Using A and B Decimals, convert result
    return `${whole}.${remainder}`;
  }

  static add(a: FixedDecimal, b: FixedDecimal) {
    if (!a || !b) return '0';

    // Subtract
    const result = a.bigInt + b.bigInt;

    const resultRoundedLength = result.toString().length - (a.decimals);

    // whole numbers
    const whole = result.toString().substring(0, resultRoundedLength) || '0';

    // remainder (decimal)
    const remainder = result.toString().substring(resultRoundedLength).padStart(a.decimals, '0');

    // Using A and B Decimals, convert result
    return `${whole}.${remainder}`;
  }

  static divide(a: FixedDecimal, b: FixedDecimal) {
    if (!a || !b || a.isZero || b.isZero) return '0';

    const result = (a.bigInt * BigInt(Math.pow(10, b.decimals))) / b.bigInt;

    const resultRoundedLength = result.toString().length - (a.decimals);

    const whole = result.toString().substring(0, resultRoundedLength) || '0';

    const remainder = result.toString().substring(resultRoundedLength).padStart(a.decimals, '0');

    return `${whole}.${remainder}`;
  }
}
