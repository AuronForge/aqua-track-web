import { AquariumListResponseDto } from '../models/aquarium-api.dto';
import {
  AquariumListInstallTimeUnit,
  AquariumListItemModel,
  AquariumListStatus,
} from '../models/aquarium-list-item.model';
import { SystemValueApiDto } from '../models/system-value-api.dto';

export function mapAquariumApiToListItem(
  aquarium: AquariumListResponseDto,
  aquariumTypeValues: readonly SystemValueApiDto[],
  now = new Date(),
): AquariumListItemModel {
  const installed = calculateInstalledAmount(aquarium.setupDate, now);

  return {
    id: aquarium.id,
    name: aquarium.name,
    aquariumType: aquarium.type,
    waterType: aquarium.waterType,
    subtitle: resolveAquariumTypeLabel(aquarium.type, aquariumTypeValues),
    volumeLiters: normalizeVolumeToLiters(aquarium.volume, aquarium.volumeUnit),
    installedAmount: installed.amount,
    installedUnit: installed.unit,
    status: mapAquariumStatus(aquarium.status),
    recentParameters: [],
  };
}

function resolveAquariumTypeLabel(
  aquariumType: string,
  aquariumTypeValues: readonly SystemValueApiDto[],
): string {
  const matchedValue = aquariumTypeValues.find((value) => value.systemValue === aquariumType);

  if (matchedValue?.displayValue) {
    return matchedValue.displayValue;
  }

  return aquariumType
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLocaleLowerCase('en-US'))
    .join(' ');
}

function normalizeVolumeToLiters(
  volume: number,
  unit: AquariumListResponseDto['volumeUnit'],
): number {
  if (unit === 'GALLON') {
    return Math.round(volume * 3.78541 * 10) / 10;
  }

  return volume;
}

function calculateInstalledAmount(
  setupDate: string,
  now: Date,
): { amount: number; unit: AquariumListInstallTimeUnit } {
  const parsedSetupDate = new Date(setupDate);

  if (Number.isNaN(parsedSetupDate.getTime())) {
    return { amount: 0, unit: 'MONTH' };
  }

  const totalMonths = Math.max(
    0,
    (now.getFullYear() - parsedSetupDate.getFullYear()) * 12 +
      (now.getMonth() - parsedSetupDate.getMonth()) -
      (now.getDate() < parsedSetupDate.getDate() ? 1 : 0),
  );

  if (totalMonths >= 12) {
    return {
      amount: Math.max(1, Math.floor(totalMonths / 12)),
      unit: 'YEAR',
    };
  }

  return {
    amount: Math.max(1, totalMonths || 1),
    unit: 'MONTH',
  };
}

function mapAquariumStatus(status: AquariumListResponseDto['status']): AquariumListStatus {
  const statusMap: Record<AquariumListResponseDto['status'], AquariumListStatus> = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    ARCHIVED: 'ARCHIVED',
  };

  return statusMap[status];
}
