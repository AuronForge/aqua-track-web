import { CardSelectionIconPosition } from './card-selection-icon-position.type';

export interface CardSelectionOption<T> {
  value: T;
  title: string;
  description?: string;
  iconName?: string;
  iconPosition?: CardSelectionIconPosition;
  disabled?: boolean;
  ariaLabel?: string;
  testId?: string;
}
