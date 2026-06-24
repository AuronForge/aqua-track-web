import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BadgeColor } from '../badge/badge-color.type';
import { BadgeComponent } from '../badge/badge.component';
import { InfoListItemBadge } from './info-list-item-badge.model';
import { InfoListItemStatus } from './info-list-item-status.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-info-list-item',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './info-list-item.component.html',
  styleUrl: './info-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'hostRole()',
    '[attr.tabindex]': 'hostTabIndex()',
    '[attr.aria-disabled]': 'hostAriaDisabled()',
    '(click)': 'handleClick()',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class InfoListItemComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly value = input.required<string>();
  readonly metadata = input<string>('');
  readonly badge = input<InfoListItemBadge | null>(null);
  readonly clickable = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly selected = input<boolean>(false);

  readonly itemClick = output<void>();

  protected readonly hostClass = computed(() =>
    [
      'info-list-item',
      this.clickable() ? 'info-list-item--clickable' : '',
      this.disabled() ? 'info-list-item--disabled' : '',
      this.selected() ? 'info-list-item--selected' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly hostRole = computed(() => (this.clickable() ? 'button' : null));
  protected readonly hostTabIndex = computed(() =>
    this.clickable() && !this.disabled() ? 0 : null,
  );
  protected readonly hostAriaDisabled = computed(() =>
    this.clickable() && this.disabled() ? true : null,
  );

  protected readonly badgeColor = computed((): BadgeColor => {
    const status = this.badge()?.status;
    if (!status) return 'primary';

    const map: Record<InfoListItemStatus, BadgeColor> = {
      normal: 'success',
      attention: 'warning',
      danger: 'error',
      neutral: 'tertiary',
    };

    return map[status];
  });

  protected handleClick(): void {
    if (!this.clickable() || this.disabled()) return;
    this.itemClick.emit();
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (!this.clickable() || this.disabled()) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.itemClick.emit();
  }
}
