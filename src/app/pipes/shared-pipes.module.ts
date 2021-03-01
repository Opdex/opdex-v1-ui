import { NgModule } from '@angular/core';
import { CoinNotationPipe } from './coin-notation.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { ShortAddressPipe } from './short-address.pipe';

@NgModule({
  declarations: [
    CoinNotationPipe,
    FormatNumberPipe,
    ShortAddressPipe
  ],
  imports: [ ],
  exports: [
    CoinNotationPipe,
    FormatNumberPipe,
    ShortAddressPipe
  ]
})
export class SharedPipesModule { }
