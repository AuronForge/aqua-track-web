import { Directive, TemplateRef, inject } from '@angular/core';

import { CardSelectionContentContext } from './card-selection-content-context.model';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[aqCardSelectionContent]',
  standalone: true,
})
export class CardSelectionContentDirective<T> {
  readonly templateRef = inject<TemplateRef<CardSelectionContentContext<T>>>(TemplateRef);
}
