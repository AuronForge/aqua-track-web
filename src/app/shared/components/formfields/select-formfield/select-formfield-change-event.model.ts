import { SelectFormfieldOption } from './select-formfield-option.model';

export interface SelectFormfieldChangeEvent {
  option: SelectFormfieldOption;
  previousOption?: SelectFormfieldOption | null;
  selectedOptions: SelectFormfieldOption[];
  previousSelectedOptions: SelectFormfieldOption[];
}
