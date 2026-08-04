export function parseLocalizedNumber(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = (value ?? '').trim().replace(',', '.');

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

export function calculateAquariumVolumeLiters(
  lengthCm: string | number | null | undefined,
  widthCm: string | number | null | undefined,
  heightCm: string | number | null | undefined,
): number | null {
  const length = parseLocalizedNumber(lengthCm);
  const width = parseLocalizedNumber(widthCm);
  const height = parseLocalizedNumber(heightCm);

  if (!length || !width || !height || length <= 0 || width <= 0 || height <= 0) {
    return null;
  }

  return roundToTwoDecimals((length * width * height) / 1000);
}

export function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
