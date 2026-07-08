import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordPolicyState {
  minLength: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

const UPPERCASE_PATTERN = /[A-Z]/;
const NUMBER_PATTERN = /\d/;
const SPECIAL_PATTERN = /[^A-Za-z0-9]/;

export function getPasswordPolicyState(password: string | null | undefined): PasswordPolicyState {
  const value = password ?? '';

  return {
    minLength: value.length >= 8,
    uppercase: UPPERCASE_PATTERN.test(value),
    number: NUMBER_PATTERN.test(value),
    special: SPECIAL_PATTERN.test(value),
  };
}

export function passwordPolicyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const state = getPasswordPolicyState(control.value);

    return Object.values(state).every(Boolean) ? null : { passwordPolicy: state };
  };
}
