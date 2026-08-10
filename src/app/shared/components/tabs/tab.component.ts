import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-tab',
  standalone: true,
  template: `
    @if (active()) {
      <ng-content />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly active = signal(false);
}
