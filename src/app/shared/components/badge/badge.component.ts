import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BadgeColor } from './badge-color.type';
import { BadgeSize } from './badge-size.type';
import { BadgeVariant } from './badge-variant.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-disabled]': 'disabled() ? true : null',
  },
})
export class BadgeComponent {
  readonly color = input<BadgeColor>('primary');
  readonly size = input<BadgeSize>('medium');
  readonly variant = input<BadgeVariant>('filled');
  readonly disabled = input<boolean>(false);

  protected readonly hostClass = computed(
    () => `badge badge--${this.variant()} badge--${this.color()} badge--${this.size()}`,
  );
}
