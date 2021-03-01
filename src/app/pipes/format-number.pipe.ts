import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {
  constructor() { }

  transform(value: number): number | string {
    if (typeof value === 'number') {
      return this.numberWithCommas(value);
    }

    return 0;
  }

  numberWithCommas(x) {
    let parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}
