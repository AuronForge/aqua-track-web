import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { FeedbackMessageItem } from '../feedback-message/feedback-message-item.model';
import { FeedbackMessageComponent } from '../feedback-message/feedback-message.component';
import { FeedbackMessageService } from '../../services/feedback-message.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-feedback-message-container',
  standalone: true,
  imports: [FeedbackMessageComponent],
  templateUrl: './feedback-message-container.component.html',
  styleUrl: './feedback-message-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackMessageContainerComponent {
  protected readonly feedbackMessageService = inject(FeedbackMessageService);

  protected readonly stackedMessages = computed(() =>
    this.feedbackMessageService.messages().map((message, index, messages) => ({
      ...message,
      stackIndex: this.getStackIndex(message, messages.slice(0, index)),
    })),
  );

  private getStackIndex(
    message: FeedbackMessageItem,
    previousMessages: FeedbackMessageItem[],
  ): number {
    return previousMessages.filter(
      (previousMessage) =>
        previousMessage.horizontalPosition === message.horizontalPosition &&
        previousMessage.verticalPosition === message.verticalPosition,
    ).length;
  }
}
