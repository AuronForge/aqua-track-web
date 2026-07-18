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
      title: aquarium.name,
      subtitle: t[aquarium.typeLabelKey],
      status: this.mapStatus(aquarium.status),
      statusLabel: this.mapStatusLabel(aquarium.status, t),
      volumeLabel: `${aquarium.volumeLiters}L`,
      installedLabel: t.aquariumListInstalledLabel,
      installedValue: this.mapInstalledValue(aquarium.installedAmount, aquarium.installedUnit, t),
      recentParameters: aquarium.recentParameters.map((parameter) =>
        this.mapParameter(parameter.key, parameter.value, t),
      ),
    };
  }

  private mapStatus(status: AquariumListStatus): InfoCardStatus {
    const map: Record<AquariumListStatus, InfoCardStatus> = {
      STABLE: 'stable',
      ATTENTION: 'attention',
      CRITICAL: 'critical',
      UNKNOWN: 'unknown',
    };
    return map[status];
  }

  private mapStatusLabel(status: AquariumListStatus, t: TranslationDictionary): string {
    const map: Record<AquariumListStatus, string> = {
      STABLE: t.statusStable,
      ATTENTION: t.statusAttention,
      CRITICAL: t.statusCritical,
      UNKNOWN: t.statusUnknown,
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
        label: t.aquariumListParameterPh,
        icon: 'science',
        value: this.formatNumber(value),
      },
      temperature: {
        label: t.aquariumListParameterTemperature,
        icon: 'device_thermostat',
        value: `${this.formatNumber(value)}°C`,
      },
      nitrate: {
        label: t.aquariumListParameterNitrate,
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
}
