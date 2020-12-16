import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ThemeService } from '@sharedServices/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-tx-box-add-liquidity',
  templateUrl: './tx-box-add-liquidity.component.html',
  styleUrls: ['./tx-box-add-liquidity.component.scss']
})
export class TxBoxAddLiquidityComponent implements OnInit {
  form: FormGroup;
  theme$: Observable<string>;
  tokens = [{
    name: 'MediConnect',
    ticker: 'MEDI',
    address: 'lkdfhalkushef89'
  }];

  get from(): FormControl {
    return this.form.get('from') as FormControl;
  }

  get fromToken(): FormControl {
    return this.form.get('fromToken') as FormControl;
  }

  get to(): FormControl {
    return this.form.get('to') as FormControl;
  }

  get toToken(): FormControl {
    return this.form.get('toToken') as FormControl;
  }

  constructor(private _fb: FormBuilder, private _themeService: ThemeService) {
    this.form = this._fb.group({
      from: [null, [Validators.required, Validators.min(.00000001)]],
      fromToken: [null, [Validators.required]],
      to: [null, [Validators.required, Validators.min(.00000001)]],
      toToken: [null, [Validators.required]]
    });

    this.theme$ = this._themeService.getTheme();
  }

  ngOnInit(): void { }
}
