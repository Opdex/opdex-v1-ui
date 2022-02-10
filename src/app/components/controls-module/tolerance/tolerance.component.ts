import { Component, EventEmitter, Input, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

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
  toleranceOptions: number[] = [ .1, .5, 1, 1.5, 2, 2.5, 3, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 99];
  filteredTolerances: number[] = [];

  constructor() {
    // validates min and max and regex - only 2 decimal places.
    this.customTolerance = new FormControl('', [Validators.min(.01), Validators.max(99.99), Validators.pattern(/^[0-9]*(\.[0-9]{0,2})?$/)]);
    this.subscription = new Subscription();

    this.subscription.add(
      this.customTolerance.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          tap((tolerance: number) => this._filterTolerances(tolerance)),
          filter(tolerance => tolerance >= .01 && tolerance <= 99.99 && this.customTolerance.valid),
          tap(tolerance => this.onToleranceChange.emit(tolerance)))
        .subscribe());
  }

  ngOnChanges() {
    if (this.value && this.value !== this.customTolerance.value) {
      this.customTolerance.setValue(this.value);
      this._setDefaultToleranceOptions();
    }
  }

  selectTolerance($event: MatAutocompleteSelectedEvent) {
    this._setDefaultToleranceOptions();
  }

  private _setDefaultToleranceOptions(): void {
    this.filteredTolerances = [...this.toleranceOptions];
  }

  private _filterTolerances(filter: number): void {
    if (!filter) return this._setDefaultToleranceOptions();

    this.filteredTolerances = this.toleranceOptions
      .filter(tolerance => tolerance.toString().includes(filter.toString()));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
