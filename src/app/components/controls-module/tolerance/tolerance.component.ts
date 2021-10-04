import { Component, EventEmitter, Input, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-tolerance',
  templateUrl: './tolerance.component.html',
  styleUrls: ['./tolerance.component.scss']
})
export class ToleranceComponent implements OnChanges, OnDestroy {
  @Input() control: FormControl;
  @Output() onToleranceChange: EventEmitter<number> = new EventEmitter();

  subscription = new Subscription();
  toleranceLevels = [
    { id: 1, tolerance: 0.1 },
    { id: 2, tolerance: 0.5 },
    { id: 3, tolerance: 1.0 }
  ];
  selectedToleranceLevel: number = this.toleranceLevels[0].id;

  ngOnChanges() {
    if (this.control) {
      this.subscription.unsubscribe();
      this.subscription = new Subscription();

      this.subscription.add(
        this.control.valueChanges
          .pipe(
            debounceTime(400),
            distinctUntilChanged(),
            filter(value => value >= .01 && value <= 99.99),
            tap(value => this.outputTolerance(value)))
          .subscribe());
    }
  }

  outputTolerance(tolerance: number) {
    const level = this.toleranceLevels.find(l => l.tolerance === tolerance);
    this.selectedToleranceLevel = level === undefined ? 4 : level.id;

    this.onToleranceChange.emit(tolerance);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
