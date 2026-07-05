import { FeedbackMessageHorizontalPosition } from './feedback-message-horizontal-position.type';
import { FeedbackMessageIconPosition } from './feedback-message-icon-position.type';
import { FeedbackMessageType } from './feedback-message-type.type';
import { FeedbackMessageVerticalPosition } from './feedback-message-vertical-position.type';

export interface FeedbackMessagePayload {
  label: string;
  horizontalPosition?: FeedbackMessageHorizontalPosition;
  verticalPosition?: FeedbackMessageVerticalPosition;
  type?: FeedbackMessageType;
  displayDurationMs?: number;
  hasIcon?: boolean;
  iconName?: string;
  iconPosition?: FeedbackMessageIconPosition;
}
