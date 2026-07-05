import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { FeedbackMessageHorizontalPosition } from './feedback-message-horizontal-position.type';
import { FeedbackMessageIconPosition } from './feedback-message-icon-position.type';
import { FeedbackMessageType } from './feedback-message-type.type';
import { FeedbackMessageVerticalPosition } from './feedback-message-vertical-position.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-feedback-message',
  standalone: true,
  templateUrl: './feedback-message.component.html',
  styleUrl: './feedback-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': 'hostRole()',
    '[attr.aria-live]': 'hostAriaLive()',
    '[style.--feedback-message-stack-offset.px]': 'stackOffsetPx()',
  },
})
export class FeedbackMessageComponent {
  readonly label = input.required<string>();
  readonly horizontalPosition = input<FeedbackMessageHorizontalPosition>('top');
  readonly verticalPosition = input<FeedbackMessageVerticalPosition>('center');
  readonly type = input<FeedbackMessageType>('information');
  readonly displayDurationMs = input<number>(5000);
  readonly stackIndex = input<number>(0);
  readonly hasIcon = input<boolean>(false);
  readonly iconName = input<string>('');
  readonly iconPosition = input<FeedbackMessageIconPosition>('start');

  protected readonly hostClass = computed(() =>
    [
      'feedback-message',
      `feedback-message--${this.type()}`,
      `feedback-message--pos-${this.positionClassName()}`,
      `feedback-message--align-${this.verticalPosition()}`,
      `feedback-message--icon-${this.iconPosition()}`,
      this.showIcon() ? 'feedback-message--with-icon' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly hostRole = computed(() =>
    this.type() === 'error' || this.type() === 'warning' ? 'alert' : 'status',
  );

  protected readonly hostAriaLive = computed(() =>
    this.type() === 'error' || this.type() === 'warning' ? 'assertive' : 'polite',
  );

  protected readonly stackOffsetPx = computed(() => this.stackIndex() * 88);
  protected readonly showIcon = computed(() => this.hasIcon());
  protected readonly resolvedIconName = computed(
    () => this.iconName().trim() || this.defaultIconMap[this.type()],
  );

  private readonly defaultIconMap: Record<FeedbackMessageType, string> = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    information: 'info',
  };

  private readonly positionClassName = computed(() => {
    const horizontalPosition = this.horizontalPosition();

    if (horizontalPosition === 'center') {
      return 'middle';
    }

    return horizontalPosition;
  });
}
