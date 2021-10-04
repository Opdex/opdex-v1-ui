import { Component, Input, EventEmitter, Output, OnDestroy, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-deadline',
  templateUrl: './deadline.component.html',
  styleUrls: ['./deadline.component.scss']
})
export class DeadlineComponent implements OnChanges, OnDestroy {
  @Input() control: FormControl;
  @Output() onDeadlineChange: EventEmitter<number> = new EventEmitter();

  subscription = new Subscription();
  deadlineLevels = [
    { id: 1, deadline: 10 },
    { id: 2, deadline: 30 },
    { id: 3, deadline: 60 }
  ];
  selectedDeadlineLevel: number = this.deadlineLevels[0].id;

  ngOnChanges() {
    if (this.control) {
      this.subscription.unsubscribe();
      this.subscription = new Subscription();

      this.subscription.add(
        this.control.valueChanges
          .pipe(
            debounceTime(400),
            distinctUntilChanged(),
            filter(value => value >= 1 && value <= 120),
            tap(value => this.outputDeadline(value)))
          .subscribe());
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
