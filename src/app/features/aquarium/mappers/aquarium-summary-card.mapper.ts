import { Injectable } from '@angular/core';

import { InfoCardStatus } from '../../../shared/components/info-card/info-card-status.type';
import { TranslationDictionary } from '../../../shared/types/translation-dictionary.type';
import {
  AquariumListItemModel,
  AquariumListStatus,
  AquariumParameterKey,
} from '../models/aquarium-list-item.model';
import {
  AquariumSummaryCardParameterViewModel,
  AquariumSummaryCardViewModel,
} from '../models/aquarium-summary-card.view-model';

@Injectable({ providedIn: 'root' })
export class AquariumSummaryCardMapper {
  mapListItem(
    aquarium: AquariumListItemModel,
    t: TranslationDictionary,
  ): AquariumSummaryCardViewModel {
    return {
      id: aquarium.id,
      title: this.normalizeText(aquarium.name),
      subtitle: this.normalizeText(aquarium.subtitle),
      status: this.mapStatus(aquarium.status),
      statusLabel: this.normalizeText(this.mapStatusLabel(aquarium.status, t)),
      volumeLabel: `${this.formatNumber(aquarium.volumeLiters)}L`,
      installedLabel: this.normalizeText(t.aquariumListInstalledLabel),
      installedValue: this.normalizeText(
        this.mapInstalledValue(aquarium.installedAmount, aquarium.installedUnit, t),
      ),
      recentParameters: aquarium.recentParameters.map((parameter) =>
        this.mapParameter(parameter.key, parameter.value, t),
      ),
      hasRecentParameters: aquarium.recentParameters.length > 0,
    };
  }

  private mapStatus(status: AquariumListStatus): InfoCardStatus {
    const map: Record<AquariumListStatus, InfoCardStatus> = {
      ACTIVE: 'stable',
      INACTIVE: 'attention',
      ARCHIVED: 'unknown',
    };
    return map[status];
  }

  private mapStatusLabel(status: AquariumListStatus, t: TranslationDictionary): string {
    const map: Record<AquariumListStatus, string> = {
      ACTIVE: t.aquariumStatusActive,
      INACTIVE: t.aquariumStatusInactive,
      ARCHIVED: t.aquariumStatusArchived,
    };
    return map[status];
  }

  private mapInstalledValue(
    amount: number,
    unit: AquariumListItemModel['installedUnit'],
    t: TranslationDictionary,
  ): string {
    if (unit === 'YEAR') {
      return amount === 1
        ? t.aquariumListInstalledYearSingular
        : t.aquariumListInstalledYearPlural.replace('{{count}}', String(amount));
    }

    return amount === 1
      ? t.aquariumListInstalledMonthSingular
      : t.aquariumListInstalledMonthPlural.replace('{{count}}', String(amount));
  }

  private mapParameter(
    key: AquariumParameterKey,
    value: number,
    t: TranslationDictionary,
  ): AquariumSummaryCardParameterViewModel {
    const config: Record<AquariumParameterKey, { label: string; icon: string; value: string }> = {
      ph: {
        label: this.normalizeText(t.aquariumListParameterPh),
        icon: 'science',
        value: this.formatNumber(value),
      },
      temperature: {
        label: this.normalizeText(t.aquariumListParameterTemperature),
        icon: 'device_thermostat',
        value: `${this.formatNumber(value)}°C`,
      },
      nitrate: {
        label: this.normalizeText(t.aquariumListParameterNitrate),
        icon: 'water_drop',
        value: this.formatNumber(value),
      },
    };

    return {
      key,
      ...config[key],
    };
  }

  private formatNumber(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  private normalizeText(value: string): string {
    // Defensively recover common UTF-8-as-Latin1 mojibake from API/mock data.
    if (!/[ÃÂ]/.test(value)) {
      return value;
    }

    try {
      return decodeURIComponent(escape(value));
    } catch {
      return value.replace(/Â(?=°)/g, '');
    }
  }
}
