import { Pipe, PipeTransform } from '@angular/core';
import { PositiveOrNegativeDecimalNumberRegex } from '@sharedLookups/regex';
import { ShortNumberTypes } from '@sharedLookups/short-number-types.lookup';

// Todo: Remove trailing zeros for numbers like 1.00M or 1.10M.
// Should result in 1M or 1.1M
@Pipe({ name: 'shortNumber' })
export class ShortNumberPipe implements PipeTransform {
  shortNumberTypes = ShortNumberTypes;

  transform(value: string | number): string {
    if (!value) return '0';

    value = typeof(value) !== 'string' ? value.toString() : value;

    const isValidNumber = value ? value.search(PositiveOrNegativeDecimalNumberRegex) : -1;

    value = isValidNumber === -1 ? 'NAN' : value;

    if (value.replace(/0/g, '').replace('.', '') === '') {
      return '0';
    }

    if (isValidNumber !== -1) {
      const hasDecimal = value.includes('.');
      const fraction = hasDecimal ?  value.substring(value.indexOf('.'), value.length) : '';
      const whole = hasDecimal ? value.substring(0, value.indexOf('.')) : value;

      if (whole.length > 3) {
        const { thousands, millions, billions, trillions } = this.shortNumberTypes;
        const types = [thousands, millions, billions, trillions];

        for (let i = 0; i < types.length; i++) {
          const last = i === types.length - 1;
          const isGreaterThanCurrent = whole.length >= types[i].digitCount;
          const isLessThanNext = !!types[i+1] && whole.length < types[i+1].digitCount;

          if (isGreaterThanCurrent && (last || isLessThanNext)) {
            value = this.createShortValue(value, types[i], whole.length);
          }
        }
      } else {
        if(whole.length <= 3 && whole.length > 0 && whole != '0') {
          if (fraction.length != 0) {
            value =  fraction === '' || parseFloat(fraction) === 0  ? whole : parseFloat(value).toFixed(2);
          }
        } else {
          const fourDecimals = `${parseFloat(value).toFixed(4)}`;
          value = fourDecimals == '0.0001' || fourDecimals == '0.0000' ? '<0.0001' : fourDecimals;
        }
      }
    }

    return value;
  }

  private createShortValue(value: string, type: any, leftOfDecimal: number): string {
    const leadingDigitsStartIndex = (leftOfDecimal - type.digitCount) + 1;
    const leadingValue = value.substring(0, leadingDigitsStartIndex);
    const decimalValue = value.substring(leadingDigitsStartIndex, (leftOfDecimal - type.digitCount) + 4);
    const finalValue = `${leadingValue}.${decimalValue}`;
    return `${parseFloat(finalValue).toFixed(2)}${type.symbol}`;
  }
}
