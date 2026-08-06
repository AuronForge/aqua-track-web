import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ButtonComponent } from '../button/button.component';
import { AqAlertVariant } from './alert-variant.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-alert',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'hostRole()',
    '[attr.aria-live]': 'hostAriaLive()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
})
export class AqAlertComponent {
  readonly variant = input<AqAlertVariant>('info');
  readonly title = input<string>();
  readonly icon = input<string>();
  readonly showIcon = input<boolean>(true);
  readonly dismissible = input<boolean>(false);
  readonly ariaLabel = input<string>();

  readonly dismissed = output<void>();

  protected readonly hostClass = computed(() =>
    [
      'alert',
      `alert--${this.variant()}`,
      this.showIcon() ? 'alert--with-icon' : 'alert--without-icon',
      this.title() ? 'alert--with-title' : 'alert--without-title',
      this.dismissible() ? 'alert--dismissible' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly resolvedIcon = computed(
    () => this.icon()?.trim() || this.defaultIconMap[this.variant()],
  );

  protected readonly hostRole = computed(() =>
    this.variant() === 'error' || this.variant() === 'warning' ? 'alert' : 'status',
  );

  protected readonly hostAriaLive = computed(() =>
    this.variant() === 'error' || this.variant() === 'warning' ? 'assertive' : 'polite',
  );

  protected readonly resolvedAriaLabel = computed(() => this.ariaLabel()?.trim() || null);

  protected dismiss(): void {
    this.dismissed.emit();
  }

  private readonly defaultIconMap: Record<AqAlertVariant, string> = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
    neutral: 'notes',
  };
}
