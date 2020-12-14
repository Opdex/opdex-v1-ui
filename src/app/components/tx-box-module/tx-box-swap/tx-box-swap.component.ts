import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '@sharedServices/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-tx-box-swap',
  templateUrl: './tx-box-swap.component.html',
  styleUrls: ['./tx-box-swap.component.scss']
})
export class TxBoxSwapComponent implements OnInit {
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
