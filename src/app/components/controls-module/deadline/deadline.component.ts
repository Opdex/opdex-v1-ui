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
  deadlineLevels = [
    { id: 1, deadline: 10 },
    { id: 2, deadline: 30 },
    { id: 3, deadline: 60 }
  ];
  selectedDeadlineLevel: number = this.deadlineLevels[0].id;

  constructor() {
    this.customDeadline = new FormControl('', [Validators.min(0), Validators.max(120), Validators.pattern(/^[0-9]*$/)]);
    this.subscription = new Subscription();

    this.subscription.add(
      this.customDeadline.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          filter(value => value >= 1 && value <= 120 && this.customDeadline.valid),
          tap(value => this.outputDeadline(value)))
        .subscribe());
  }

  ngOnChanges() {
    if (this.value) {
      const level = this.deadlineLevels.find(l => l.deadline === this.value);
      if (level !== undefined) {
        this.outputDeadline(this.value);
      } else {
        this.customDeadline.setValue(this.value);
      }
    }
  }

  outputDeadline(deadline: number) {
    const level = this.deadlineLevels.find(l => l.deadline === deadline);
    this.selectedDeadlineLevel = level === undefined ? 4 : level.id;

    this.onDeadlineChange.emit(deadline);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
