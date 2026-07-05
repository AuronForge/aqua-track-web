import { buildInitials } from './build-initials.util';

describe('buildInitials', () => {
  it('should return "U" when the name is undefined', () => {
    expect(buildInitials(undefined)).toBe('U');
  });

  it('should return "U" when the name is null', () => {
    expect(buildInitials(null)).toBe('U');
  });

  it('should return "U" when the name is blank', () => {
    expect(buildInitials('   ')).toBe('U');
  });

  it('should return a single initial for a one-word name', () => {
    expect(buildInitials('John')).toBe('J');
  });

  it('should return first and last initials for a multi-word name', () => {
    expect(buildInitials('John Doe')).toBe('JD');
  });

  it('should combine first and last word initials for names with more than two words', () => {
    expect(buildInitials('John Middle Doe')).toBe('JD');
  });

  it('should uppercase lowercase names', () => {
    expect(buildInitials('john doe')).toBe('JD');
  });
});
