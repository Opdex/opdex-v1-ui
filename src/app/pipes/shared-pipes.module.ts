import { NgModule } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';
import { CoinNotationPipe } from './coin-notation.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { ShortAddressPipe } from './short-address.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { ShortNumberPipe } from './short-number.pipe';

@NgModule({
  declarations: [
    CoinNotationPipe,
    FormatNumberPipe,
    ShortAddressPipe,
    TimeAgoPipe,
    ShortNumberPipe
  ],
  imports: [
    TimeagoModule.forRoot()
  ],
  exports: [
    CoinNotationPipe,
    FormatNumberPipe,
    ShortAddressPipe,
    TimeAgoPipe,
    TimeagoModule,
    ShortNumberPipe
  ]
})
export class SharedPipesModule { }
