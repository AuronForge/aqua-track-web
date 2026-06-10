import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ButtonColor } from './button-color.type';
import { ButtonSize } from './button-size.type';
import { ButtonVariant } from './button-variant.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[aqButton], a[aqButton]',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('flat');
  readonly color = input<ButtonColor>('primary');
  readonly size = input<ButtonSize>('medium');

  protected readonly hostClass = computed(
    () => `btn btn--${this.variant()} btn--${this.color()} btn--${this.size()}`,
  );
}
