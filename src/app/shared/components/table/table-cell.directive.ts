import { Directive, TemplateRef, inject, input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[aqTableCell]',
  standalone: true,
})
export class AqTableCellDirective<T = unknown> {
  readonly key = input.required<string>({ alias: 'aqTableCell' });
  readonly templateRef = inject<TemplateRef<{ $implicit: T }>>(TemplateRef);
}
