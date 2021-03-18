import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '@sharedServices/theme.service';
import { Observable } from 'rxjs';
import { SignTxModalComponent } from 'src/app/components/modals-module/sign-tx-modal/sign-tx-modal.component';

@Component({
  selector: 'opdex-tx-box-swap',
  templateUrl: './tx-box-swap.component.html',
  styleUrls: ['./tx-box-swap.component.scss']
})
export class TxBoxSwapComponent implements OnInit {
  form: FormGroup;
  theme$: Observable<string>;
  tokens = [{
    name: 'MediConnect',
    ticker: 'MEDI',
    address: 'lkdfhalkushef89'
  }, {
    name: 'Cirrus',
    ticker: 'CRS',
    address: 'ntsirhniuabeaoadrhjkluysihrabgergasdf'
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

  constructor(private _fb: FormBuilder, private _themeService: ThemeService,
    private _dialog: MatDialog) {
    this.form = this._fb.group({
      from: [null, [Validators.required, Validators.min(.00000001)]],
      fromToken: [null, [Validators.required]],
      to: [null, [Validators.required, Validators.min(.00000001)]],
      toToken: [null, [Validators.required]]
    });

    this.theme$ = this._themeService.getTheme();
  }

  ngOnInit(): void { }

  signTx(): void {
    this._dialog.open(SignTxModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: ''
    });
  }
}
