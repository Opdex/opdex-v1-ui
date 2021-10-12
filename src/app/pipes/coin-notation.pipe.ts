import { Pipe, PipeTransform } from '@angular/core';
import { TokensService } from '@sharedServices/platform/tokens.service';

@Pipe({
  name: 'coinNotation'
})
export class CoinNotationPipe implements PipeTransform {
  constructor(private _tokenService: TokensService) { }

  transform(value: number, decimals: number = 8, fixed?: boolean): number | string {
    let temp: number;

    if (typeof value === 'string') {
      let bigint = BigInt(value);
      var satsPerToken = this._tokenService.getSats(decimals);
      temp = parseFloat((bigint / satsPerToken).toString());

      return fixed ? temp.toFixed(decimals) || 0 : this.numberWithCommas(temp);
    }


    if (typeof value === 'number') {
      var satsPerToken = this._tokenService.getSats(decimals);
      temp = parseFloat((BigInt(value) / satsPerToken).toString());
      return fixed ? temp?.toFixed(decimals) || 0 : this.numberWithCommas(temp);
    }

    return 0;
  }

  numberWithCommas(x) {
    let parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}

