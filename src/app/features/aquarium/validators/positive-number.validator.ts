import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { parseLocalizedNumber } from '../utils/aquarium-volume.util';

export function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const parsed = parseLocalizedNumber(control.value);

    if (parsed === null) {
      return { number: true };
    }

    return parsed > 0 ? null : { positive: true };
  };
}
