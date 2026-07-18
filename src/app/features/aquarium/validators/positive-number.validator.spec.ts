import { FormControl } from '@angular/forms';

import { positiveNumberValidator } from './positive-number.validator';

describe('positiveNumberValidator', () => {
  const validator = positiveNumberValidator();

  it('accepts positive numbers and localized decimals', () => {
    expect(validator(new FormControl('1'))).toBeNull();
    expect(validator(new FormControl('1,5'))).toBeNull();
  });

  it('rejects empty, non-numeric, zero and negative values', () => {
    expect(validator(new FormControl(''))).toEqual({ number: true });
    expect(validator(new FormControl('abc'))).toEqual({ number: true });
    expect(validator(new FormControl('0'))).toEqual({ positive: true });
    expect(validator(new FormControl('-1'))).toEqual({ positive: true });
  });
});
