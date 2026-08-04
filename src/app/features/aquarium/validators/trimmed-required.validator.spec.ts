import { FormControl } from '@angular/forms';

import { trimmedRequiredValidator } from './trimmed-required.validator';

describe('trimmedRequiredValidator', () => {
  const validator = trimmedRequiredValidator();

  it('accepts text with non-space characters', () => {
    expect(validator(new FormControl('  Reef Paradise  '))).toBeNull();
  });

  it('rejects empty or blank text', () => {
    expect(validator(new FormControl(null))).toEqual({ required: true });
    expect(validator(new FormControl(''))).toEqual({ required: true });
    expect(validator(new FormControl('   '))).toEqual({ required: true });
  });
});
