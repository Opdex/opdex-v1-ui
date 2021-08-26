import { Pipe, PipeTransform } from '@angular/core';
import { ShortNumberTypes } from '@sharedLookups/short-number-types.lookup';

// Todo: Remove trailing zeros for numbers like 1.00M or 1.10M.
// Should result in 1M or 1.1M
@Pipe({ name: 'shortNumber' })
export class ShortNumberPipe implements PipeTransform {

  shortNumberTypes = ShortNumberTypes;

  transform(value: string | number): string {
    if (!value) return '0';
    
    value = typeof(value) === 'number' ? value.toString() : value;

    const isValidNumber = value ? value.search(/^\d*(\.\d+)?$/gm) : -1;
    value = isValidNumber === -1 ? 'NAN' : value;

    if (value.replace(/0/g, '').replace('.', '') === '') {
      return '0';
    }

    if (isValidNumber !== -1) {
      const hasDecimal = value.includes('.');
      const decimalSubstring = hasDecimal ?  value.substring(value.indexOf('.'), value.length) : '';
      const leftOfDecimalSubString = hasDecimal ? value.substring(0, value.indexOf('.')) : value;

      if (leftOfDecimalSubString.length > 3) {
        if (leftOfDecimalSubString.length >= this.shortNumberTypes.thousands.digitCount && leftOfDecimalSubString.length < this.shortNumberTypes.millions.digitCount) {
          value = this.createShortValue(value, this.shortNumberTypes.thousands, leftOfDecimalSubString.length);
        }
        if (leftOfDecimalSubString.length >= this.shortNumberTypes.millions.digitCount && leftOfDecimalSubString.length < this.shortNumberTypes.billions.digitCount) {
          value = this.createShortValue(value, this.shortNumberTypes.millions, leftOfDecimalSubString.length);
        }
        if (leftOfDecimalSubString.length >= this.shortNumberTypes.billions.digitCount && leftOfDecimalSubString.length < this.shortNumberTypes.trillions.digitCount) {
          value = this.createShortValue(value, this.shortNumberTypes.billions, leftOfDecimalSubString.length);
        }
        if (leftOfDecimalSubString.length >= this.shortNumberTypes.trillions.digitCount && leftOfDecimalSubString.length) {
          value = this.createShortValue(value, this.shortNumberTypes.trillions, leftOfDecimalSubString.length);
        }
      } else {
        if(leftOfDecimalSubString.length <= 3 && leftOfDecimalSubString.length > 0 && leftOfDecimalSubString != '0') {
          if (decimalSubstring.length != 0) {
            value =  decimalSubstring === '' || parseFloat(decimalSubstring) === 0  ? leftOfDecimalSubString : parseFloat(value).toFixed(2);
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
