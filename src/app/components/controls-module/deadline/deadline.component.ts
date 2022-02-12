import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Component, Input, EventEmitter, Output, OnDestroy, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-deadline',
  templateUrl: './deadline.component.html',
  styleUrls: ['./deadline.component.scss']
})
export class DeadlineComponent implements OnChanges, OnDestroy {
  @Input() value: number;
  @Output() onDeadlineChange: EventEmitter<number> = new EventEmitter();
  customDeadline: FormControl;
  subscription: Subscription;
  estimatedBlocks: number;
  deadlineOptions: number[] = [];
  filteredDeadlines: number[] = [];

  constructor() {
    for (var i = 5; i < 125; i += 5) {
      this.deadlineOptions.push(i);
    }

    this.customDeadline = new FormControl('', [Validators.min(0), Validators.max(120), Validators.pattern(/^[0-9]*$/)]);
    this.subscription = new Subscription();

    this.subscription.add(
      this.customDeadline.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          tap((deadline: number) => this._filterDeadlines(deadline)),
          filter(deadline => deadline >= 1 && deadline <= 120 && this.customDeadline.valid),
          tap(deadline => this.estimatedBlocks = Math.ceil(60 * deadline / 16)),
          tap(deadline => this.onDeadlineChange.emit(deadline)))
        .subscribe());
  }

  ngOnChanges() {
    if (this.value && this.value !== this.customDeadline.value) {
      this.customDeadline.setValue(this.value);
      this._setDefaultDeadlineOptions();
    }
  }

  selectDeadline($event: MatAutocompleteSelectedEvent) {
    this._setDefaultDeadlineOptions();
  }

  private _setDefaultDeadlineOptions(): void {
    this.filteredDeadlines = [...this.deadlineOptions];
  }

  private _filterDeadlines(filter: number): void {
    if (!filter) return this._setDefaultDeadlineOptions();

    this.filteredDeadlines = this.deadlineOptions
      .filter(deadline => deadline.toString().includes(filter.toString()));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
