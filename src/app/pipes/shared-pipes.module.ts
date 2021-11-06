import { NgModule } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';

import { CoinNotationPipe } from './coin-notation.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { ShortAddressPipe } from './short-address.pipe';
import { ShortNumberPipe } from './short-number.pipe';
import { ContractParameterPipe } from './contract-parameter.pipe';

@NgModule({
  declarations: [
    CoinNotationPipe,
    FormatNumberPipe,
    ShortAddressPipe,
    ShortNumberPipe,
    ContractParameterPipe
  ],
  imports: [
    TimeagoModule.forRoot()
  ],
  providers: [
    FormatNumberPipe
  ],
  exports: [
    TimeagoModule,
    CoinNotationPipe,
    FormatNumberPipe,
    ShortAddressPipe,
    ShortNumberPipe,
    ContractParameterPipe
  ]
})
export class SharedPipesModule { }
