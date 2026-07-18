import {
  calculateAquariumVolumeLiters,
  parseLocalizedNumber,
  roundToTwoDecimals,
} from './aquarium-volume.util';

describe('aquarium volume utils', () => {
  it('parses localized decimal values', () => {
    expect(parseLocalizedNumber('10,5')).toBe(10.5);
    expect(parseLocalizedNumber('10.5')).toBe(10.5);
    expect(parseLocalizedNumber(10.5)).toBe(10.5);
    expect(parseLocalizedNumber(Number.POSITIVE_INFINITY)).toBeNull();
    expect(parseLocalizedNumber(null)).toBeNull();
    expect(parseLocalizedNumber(undefined)).toBeNull();
    expect(parseLocalizedNumber('')).toBeNull();
    expect(parseLocalizedNumber('abc')).toBeNull();
  });

  it('calculates aquarium volume in liters', () => {
    expect(calculateAquariumVolumeLiters('35', '45', '65')).toBe(102.38);
  });

  it('returns null when dimensions cannot produce a positive volume', () => {
    expect(calculateAquariumVolumeLiters('35', '0', '65')).toBeNull();
    expect(calculateAquariumVolumeLiters('35', 'abc', '65')).toBeNull();
  });

  it('rounds values to two decimals', () => {
    expect(roundToTwoDecimals(12.345)).toBe(12.35);
    expect(roundToTwoDecimals(12.344)).toBe(12.34);
  });
});
