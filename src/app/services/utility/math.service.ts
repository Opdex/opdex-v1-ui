import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MathService {
  static multiply(a: FixedDecimal, b: FixedDecimal): FixedDecimal {
    if (!a || !b) return FixedDecimal.Zero(a.decimals);

    let product = a.bigInt * b.bigInt;
    let isNegative = product < 0;

    if (isNegative) product *= BigInt(-1);

    if (product === BigInt(0)) return FixedDecimal.Zero(a.decimals);

    // Cut the string off at the precision point, no rounding is implemented.
    const productRoundedLength = product.toString().length - (a.decimals + b.decimals);

    // whole numbers
    const whole = product.toString().substring(0, productRoundedLength) || '0';

    // remainder (decimal)
    const remainder = product.toString().substring(productRoundedLength).padStart(a.decimals + b.decimals, '0');

    // Using A and B Decimals, convert result
    const total = `${isNegative ? '-' : ''}${whole}.${remainder}`;

    // round
    const resultString = total.substring(0, whole.length + 1 + a.decimals);

    return new FixedDecimal(resultString, a.decimals);
  }

  static subtract(a: FixedDecimal, b: FixedDecimal): FixedDecimal {
    if (!a || !b) return FixedDecimal.Zero(a.decimals);

    const resultDecimalLength = a.decimals;

    if (a.decimals < b.decimals) {
      a.resize(b.decimals);
    } else if (a.decimals > b.decimals) {
      b.resize(a.decimals);
    }

    // Subtract
    let result = a.bigInt - b.bigInt;
    let isNegative = result < 0;

    if (isNegative) result *= BigInt(-1);

    const resultRoundedLength = result.toString().length - (a.decimals);

    // whole numbers
    const whole = result.toString().substring(0, resultRoundedLength) || '0';

    // remainder (decimal)
    const remainder = result.toString().substring(resultRoundedLength).padStart(a.decimals, '0');

    // Using A and B Decimals, convert result
    const resultString = `${isNegative ? '-' : ''}${whole}.${remainder}`;

    return new FixedDecimal(resultString, resultDecimalLength);
  }

  static add(a: FixedDecimal, b: FixedDecimal): FixedDecimal {
    if (!a || !b) return FixedDecimal.Zero(a.decimals);

    const resultDecimalLength = a.decimals;

    if (a.decimals < b.decimals) {
      a.resize(b.decimals);
    } else if (a.decimals > b.decimals) {
      b.resize(a.decimals);
    }

    // Add
    let result = a.bigInt + b.bigInt;
    let isNegative = result < 0;

    if (isNegative) result *= BigInt(-1);

    const resultRoundedLength = result.toString().length - (a.decimals);

    // whole numbers
    const whole = result.toString().substring(0, resultRoundedLength) || '0';

    // remainder (decimal)
    const remainder = result.toString().substring(resultRoundedLength).padStart(a.decimals, '0');

    // Using A and B Decimals, convert result
    const resultString = `${isNegative ? '-' : ''}${whole}.${remainder}`;

    return new FixedDecimal(resultString, resultDecimalLength);
  }

  static divide(a: FixedDecimal, b: FixedDecimal): FixedDecimal {
    if (!a || !b || a.isZero || b.isZero) return FixedDecimal.Zero(a.decimals);

    let result = (a.bigInt * BigInt(Math.pow(10, b.decimals))) / b.bigInt;
    let isNegative = result < 0;

    if (isNegative) result *= BigInt(-1);

    const resultRoundedLength = result.toString().length - (a.decimals);

    const whole = result.toString().substring(0, resultRoundedLength) || '0';

    const remainder = result.toString().substring(resultRoundedLength).padStart(a.decimals, '0');

    const resultString = `${isNegative ? '-' : ''}${whole}.${remainder}`;

    return new FixedDecimal(resultString, a.decimals);
  }
}
