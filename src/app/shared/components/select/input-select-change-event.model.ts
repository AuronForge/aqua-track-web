import { InputSelectOption } from './input-select-option.model';

export interface InputSelectChangeEvent {
  option: InputSelectOption;
  previousOption: InputSelectOption | null;
}
