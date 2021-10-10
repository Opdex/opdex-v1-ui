import { Component, EventEmitter, Input, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, max, min, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-tolerance',
  templateUrl: './tolerance.component.html',
  styleUrls: ['./tolerance.component.scss']
})
export class ToleranceComponent implements OnChanges, OnDestroy {
  @Input() value: number;
  @Output() onToleranceChange: EventEmitter<number> = new EventEmitter();
  customTolerance: FormControl;
  subscription = new Subscription();
  toleranceLevels = [
    { id: 1, tolerance: 0.1 },
    { id: 2, tolerance: 0.5 },
    { id: 3, tolerance: 1.0 }
  ];
  selectedToleranceLevel: number = this.toleranceLevels[0].id;

  constructor() {
    // validates min and max and regex - only 2 decimal places.
    this.customTolerance = new FormControl('', [Validators.min(.01), Validators.max(99.99), Validators.pattern(/^[0-9]*(\.[0-9]{0,2})?$/)]);
    this.subscription = new Subscription();

    this.subscription.add(
      this.customTolerance.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          filter(value => value >= .01 && value <= 99.99 && this.customTolerance.valid),
          tap(value => this.outputTolerance(value)))
        .subscribe());
  }

  ngOnChanges() {
    if (this.value) {
      const level = this.toleranceLevels.find(l => l.tolerance === this.value);
      if (level !== undefined) {
        console.log(this.value)
        this.outputTolerance(this.value);
      } else {
        this.customTolerance.setValue(this.value);
      }
    }
  }

  outputTolerance(tolerance: number) {
    console.log(tolerance)
    const level = this.toleranceLevels.find(l => l.tolerance === tolerance);
    this.selectedToleranceLevel = level === undefined ? 4 : level.id;

    this.onToleranceChange.emit(tolerance);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
