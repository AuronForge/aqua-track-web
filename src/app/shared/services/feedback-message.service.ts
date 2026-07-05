import { Injectable, computed, signal } from '@angular/core';

import { FeedbackMessageItem } from '../components/feedback-message/feedback-message-item.model';
import { FeedbackMessagePayload } from '../components/feedback-message/feedback-message-payload.model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackMessageService {
  private readonly messagesSignal = signal<FeedbackMessageItem[]>([]);
  private readonly clearTimeoutIds = new Map<number, ReturnType<typeof setTimeout>>();
  private nextMessageId = 1;

  readonly messages = this.messagesSignal.asReadonly();
  readonly message = computed(() => this.messages()[0] ?? null);

  show(message: FeedbackMessagePayload): void {
    const messageItem: FeedbackMessageItem = {
      id: this.nextMessageId++,
      horizontalPosition: 'top',
      verticalPosition: 'center',
      type: 'information',
      displayDurationMs: 5000,
      hasIcon: false,
      iconName: '',
      iconPosition: 'start',
      ...message,
    };

    this.messagesSignal.update((currentMessages) => [...currentMessages, messageItem]);

    const displayDurationMs = messageItem.displayDurationMs ?? 5000;

    if (displayDurationMs > 0) {
      const timeoutId = setTimeout(() => {
        this.dismiss(messageItem.id);
        this.clearTimeoutIds.delete(messageItem.id);
      }, displayDurationMs);

      this.clearTimeoutIds.set(messageItem.id, timeoutId);
    }
  }

  showSuccess(
    label: string,
    options: Partial<Omit<FeedbackMessagePayload, 'label' | 'type'>> = {},
  ): void {
    this.show({ label, type: 'success', ...options });
  }

  showError(
    label: string,
    options: Partial<Omit<FeedbackMessagePayload, 'label' | 'type'>> = {},
  ): void {
    this.show({ label, type: 'error', ...options });
  }

  showWarning(
    label: string,
    options: Partial<Omit<FeedbackMessagePayload, 'label' | 'type'>> = {},
  ): void {
    this.show({ label, type: 'warning', ...options });
  }

  showInformation(
    label: string,
    options: Partial<Omit<FeedbackMessagePayload, 'label' | 'type'>> = {},
  ): void {
    this.show({ label, type: 'information', ...options });
  }

  clear(): void {
    for (const timeoutId of this.clearTimeoutIds.values()) {
      clearTimeout(timeoutId);
    }

    this.clearTimeoutIds.clear();
    this.messagesSignal.set([]);
  }

  dismiss(id: number): void {
    this.clearScheduledDismiss(id);
    this.messagesSignal.update((currentMessages) =>
      currentMessages.filter((message) => message.id !== id),
    );
  }

  private clearScheduledDismiss(id: number): void {
    const timeoutId = this.clearTimeoutIds.get(id);

    if (!timeoutId) {
      return;
    }

    clearTimeout(timeoutId);
    this.clearTimeoutIds.delete(id);
  }
}
