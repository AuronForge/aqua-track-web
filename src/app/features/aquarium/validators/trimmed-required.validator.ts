import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function trimmedRequiredValidator(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value ?? '';

    return value.trim().length > 0 ? null : { required: true };
  };
}
