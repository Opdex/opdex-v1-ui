import { Pipe, PipeTransform } from '@angular/core';
import { TokenService } from '@sharedServices/token.service';

@Pipe({
  name: 'coinNotation'
})
export class CoinNotationPipe implements PipeTransform {
  constructor(private _tokenService: TokenService) { }

  transform(value: number, decimals: number = 8, fixed?: boolean): number | string {
    let temp;
    if (typeof value === 'number') {
      var satsPerToken = this._tokenService.getSats(decimals);
      temp = value / satsPerToken;
      return fixed ? temp.toFixed(decimals) : this.numberWithCommas(temp);
    }

    return 0;
  }

  numberWithCommas(x) {
    let parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}

