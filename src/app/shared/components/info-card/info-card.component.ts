import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BadgeComponent } from '../badge/badge.component';
import { BadgeColor } from '../badge/badge-color.type';
import { InfoCardMetric } from './info-card-metric.model';
import { InfoCardStatus } from './info-card-status.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-info-card',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'hostRole()',
    '[attr.tabindex]': 'hostTabIndex()',
    '(click)': 'handleClick()',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class InfoCardComponent {
  readonly icon = input<string>('');
  readonly iconFamily = input<string>('material-icons-outlined');
  readonly status = input<InfoCardStatus>('stable');
  readonly statusLabel = input<string>('');
  readonly title = input.required<string>();
  readonly subtitleLabel = input<string>('');
  readonly subtitleValue = input<string>('');
  readonly metrics = input<InfoCardMetric[]>([]);
  readonly clickable = input<boolean>(false);
  readonly fillContainer = input<boolean>(false);
  readonly selected = input<boolean>(false);
  readonly alignTop = input<boolean>(false);
  readonly titleMetric = input<InfoCardMetric | null>(null);
  readonly cardClick = output<void>();

  protected readonly hostClass = computed(() =>
    [
      'info-card',
      `info-card--${this.status()}`,
      this.clickable() ? 'info-card--interactive' : '',
      this.fillContainer() ? 'info-card--fill' : '',
      this.selected() ? 'info-card--selected' : '',
      this.alignTop() ? 'info-card--align-top' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
  protected readonly hostRole = computed(() => (this.clickable() ? 'button' : null));
  protected readonly hostTabIndex = computed(() => (this.clickable() ? 0 : null));

  protected readonly hasSubtitle = computed(() => !!this.subtitleLabel() || !!this.subtitleValue());

  protected readonly statusBadgeColor = computed((): BadgeColor => {
    const map: Record<InfoCardStatus, BadgeColor> = {
      stable: 'success',
      attention: 'warning',
      critical: 'error',
      unknown: 'secondary',
    };
    return map[this.status()];
  });

  protected handleClick(): void {
    if (!this.clickable()) {
      return;
    }

    this.cardClick.emit();
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (!this.clickable()) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.cardClick.emit();
  }
}
