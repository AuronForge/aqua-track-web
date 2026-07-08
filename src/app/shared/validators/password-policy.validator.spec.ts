import { FormControl } from '@angular/forms';

import { getPasswordPolicyState, passwordPolicyValidator } from './password-policy.validator';

describe('password-policy.validator', () => {
  describe('getPasswordPolicyState', () => {
    it('should return all requirements as false for nullish values', () => {
      expect(getPasswordPolicyState(null)).toEqual({
        minLength: false,
        uppercase: false,
        number: false,
        special: false,
      });
      expect(getPasswordPolicyState(undefined)).toEqual({
        minLength: false,
        uppercase: false,
        number: false,
        special: false,
      });
    });

    it('should return the requirement state for a partial password', () => {
      expect(getPasswordPolicyState('abcDefgh')).toEqual({
        minLength: true,
        uppercase: true,
        number: false,
        special: false,
      });
    });

    it('should return all requirements as true for a valid password', () => {
      expect(getPasswordPolicyState('Valid@123')).toEqual({
        minLength: true,
        uppercase: true,
        number: true,
        special: true,
      });
    });
  });

  describe('passwordPolicyValidator', () => {
    it('should return a validation error with the policy state when the password is invalid', () => {
      const validator = passwordPolicyValidator();
      const result = validator(new FormControl('abc'));

      expect(result).toEqual({
        passwordPolicy: {
          minLength: false,
          uppercase: false,
          number: false,
          special: false,
        },
      });
    });

    it('should return null when the password satisfies all requirements', () => {
      const validator = passwordPolicyValidator();

      expect(validator(new FormControl('Valid@123'))).toBeNull();
    });
  });
});
