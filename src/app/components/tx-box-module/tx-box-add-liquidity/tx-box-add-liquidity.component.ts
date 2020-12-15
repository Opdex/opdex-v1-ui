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

  get from(): FormControl {
    return this.form.get('from') as FormControl;
  }

  get to(): FormControl {
    return this.form.get('to') as FormControl;
  }

  constructor(private _fb: FormBuilder, private _themeService: ThemeService) {
    this.form = this._fb.group({
      from: [null, [Validators.required, Validators.min(.00000001)]],
      to: [null, [Validators.required, Validators.min(.00000001)]],
    });

    this.theme$ = this._themeService.getTheme();
  }

  ngOnInit(): void { }
}
