import { dateOnlyToIso } from './date-only-to-iso.util';

describe('dateOnlyToIso', () => {
  it('keeps the selected date stable when serializing to ISO midnight UTC', () => {
    expect(dateOnlyToIso('2026-07-09')).toBe('2026-07-09T00:00:00.000Z');
  });
});
