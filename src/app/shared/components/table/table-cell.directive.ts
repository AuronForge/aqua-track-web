import { Directive, TemplateRef, inject, input } from '@angular/core';

import { AqTableCellContext } from './table-cell-context.model';
import { AqTableRow } from './table-column.model';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[aqTableCell]',
  standalone: true,
})
export class AqTableCellDirective<T extends AqTableRow = AqTableRow> {
  readonly key = input.required<string>({ alias: 'aqTableCell' });
  readonly templateRef = inject<TemplateRef<AqTableCellContext<T>>>(TemplateRef);
}
