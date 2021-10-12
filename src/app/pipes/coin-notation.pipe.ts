import { FixedDecimal } from './../models/types/fixed-decimal';
import { Pipe, PipeTransform } from '@angular/core';
import { TokensService } from '@sharedServices/platform/tokens.service';

@Pipe({
  name: 'coinNotation'
})
export class CoinNotationPipe implements PipeTransform {
  transform(value: number, decimals: number = 8): number | string {
    var valueString = value.toString().padStart(decimals, '0');
    console.log(valueString);

    if (valueString.length === decimals) {
      valueString = `0.${valueString}`;
    }

    var fixedDecimal = new FixedDecimal(valueString, decimals);

    return this.numberWithCommas(fixedDecimal.formattedValue);
  }

  private numberWithCommas(num: string): string {
    let parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}

