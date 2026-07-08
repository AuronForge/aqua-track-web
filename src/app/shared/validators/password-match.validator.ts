import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(
  passwordControlName: string,
  confirmPasswordControlName: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordControlName)?.value;
    const confirmPassword = group.get(confirmPasswordControlName)?.value;

    return password === confirmPassword ? null : { passwordsMismatch: true };
  };
}

export function passwordDifferentFromCurrentValidator(
  currentPasswordControlName: string,
  newPasswordControlName: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const currentPassword = group.get(currentPasswordControlName)?.value;
    const newPassword = group.get(newPasswordControlName)?.value;

    if (!currentPassword || !newPassword) {
      return null;
    }

    return currentPassword === newPassword ? { passwordUnchanged: true } : null;
  };
}
