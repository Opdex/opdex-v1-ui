import { NgModule } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';
import { CoinNotationPipe } from './coin-notation.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { ShortAddressPipe } from './short-address.pipe';
import { TimeAgoPipe } from './time-ago.pipe';

@NgModule({
  declarations: [
    CoinNotationPipe,
    FormatNumberPipe,
    ShortAddressPipe,
    TimeAgoPipe
  ],
  imports: [
    TimeagoModule.forRoot()
  ],
  exports: [
    CoinNotationPipe,
    FormatNumberPipe,
    ShortAddressPipe,
    TimeAgoPipe,
    TimeagoModule
  ]
})
export class SharedPipesModule { }
