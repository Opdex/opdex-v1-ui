import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number | string, decimals: number = 2): string {
    if (value == null) value = 0;

    const fixed = new FixedDecimal(value.toString(), decimals);

    let parts: string[] = fixed.formattedValue.split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
  }
}
