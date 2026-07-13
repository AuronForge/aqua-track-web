import { CardSelectionOption } from './card-selection-option.model';
import { CardSelectionValue } from './card-selection-value.type';

export interface CardSelectionChange<T> {
  value: Exclude<CardSelectionValue<T>, null>;
  option: CardSelectionOption<T>;
  selected: boolean;
  selectedOptions: readonly CardSelectionOption<T>[];
}
