import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ChipColor } from './chip-color.type';
import { ChipSize } from './chip-size.type';
import { ChipVariant } from './chip-variant.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-chip',
  standalone: true,
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-disabled]': 'disabled() ? true : null',
  },
})
export class ChipComponent {
  readonly color = input<ChipColor>('primary');
  readonly size = input<ChipSize>('medium');
  readonly variant = input<ChipVariant>('filled');
  readonly disabled = input<boolean>(false);

  protected readonly hostClass = computed(
    () => `chip chip--${this.variant()} chip--${this.color()} chip--${this.size()}`,
  );
}
