import { TemplateRef, ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';

let nextUniqueTabId = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-tab',
  standalone: true,
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tab',
  },
})
export class TabComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input<boolean>(false);

  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');
  readonly uniqueId = `aq-tab-${nextUniqueTabId++}`;
}
