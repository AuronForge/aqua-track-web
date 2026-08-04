import { CardSelectionOption } from './card-selection-option.model';

export interface CardSelectionContentContext<T> {
  $implicit: CardSelectionOption<T>;
  option: CardSelectionOption<T>;
  index: number;
  selected: boolean;
  disabled: boolean;
}
