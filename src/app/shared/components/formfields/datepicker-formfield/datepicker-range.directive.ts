import { Directive, input } from '@angular/core';

export interface DatepickerRangeValue {
  start: string;
  end: string;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'aq-datepicker-formfield[aqDateRange]',
  standalone: true,
})
export class DatepickerRangeDirective {
  readonly separator = input(' - ');
}
