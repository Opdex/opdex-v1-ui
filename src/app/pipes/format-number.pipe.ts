import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {
  constructor() { }

  transform(value: number | string, decimals: number = 2): string {
    if (value == null) value = 0;

    let parts: string[] = typeof value === 'number'
      ? value.toFixed(decimals).toString().split('.')
      : parseFloat(value).toFixed(decimals).split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
  }
}
