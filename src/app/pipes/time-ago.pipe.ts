import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(time: Date): string {
    return '';
  }
}
