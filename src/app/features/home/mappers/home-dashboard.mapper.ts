import { Injectable, inject } from '@angular/core';

import { InfoCardStatus } from '../../../shared/components/info-card/info-card-status.type';
import { InfoListItemBadge } from '../../../shared/components/info-list-item/info-list-item-badge.model';
import { InfoListItemStatus } from '../../../shared/components/info-list-item/info-list-item-status.type';
import { LanguageService } from '../../../shared/services/language.service';
import { TranslationDictionary } from '../../../shared/types/translation-dictionary.type';
import {
  AquariumHealthStatus,
  DashboardApiDto,
  DashboardAquariumDto,
  MeasurementUnit,
  RecentApplicationDto,
  RecentMeasurementDto,
  VariationDirection,
  WaterParameterDto,
  WaterParameterStatus,
  WaterParameterVariationDto,
} from '../models';
import { AquariumCardViewModel } from '../models/aquarium-card-view.model';
import { HomeDashboardViewModel } from '../models/home-dashboard-view.model';
import {
  ParameterVariationDirection,
  WaterParameterCardViewModel,
} from '../models/water-parameter-card-view.model';
import { RecentApplicationViewModel } from '../models/recent-application-view.model';
import { RecentMeasurementViewModel } from '../models/recent-measurement-view.model';

@Injectable({ providedIn: 'root' })
export class HomeDashboardMapper {
  private readonly languageService = inject(LanguageService);

  mapDashboardDtoToViewModel(dto: DashboardApiDto): HomeDashboardViewModel {
    const t = this.languageService.translation();
    return {
      aquariumCards: dto.aquariums.map((aq) => this.mapAquariumCard(aq, t)),
      selectedAquariumId: dto.selectedAquarium?.id ?? dto.aquariums[0]?.id ?? null,
      waterParameters: dto.waterParameters.map((p) => this.mapWaterParameter(p, t)),
      recentMeasurements: dto.recentMeasurements.map((m) => this.mapRecentMeasurement(m, t)),
      recentApplications: dto.recentApplications.map((a) => this.mapRecentApplication(a)),
    };
  }

  private mapAquariumCard(
    dto: DashboardAquariumDto,
    t: TranslationDictionary,
  ): AquariumCardViewModel {
    const metrics = [];
    if (dto.summary.ph !== undefined) {
      metrics.push({ label: t.metricPhLevel, value: String(dto.summary.ph) });
    }
    if (dto.summary.temperature !== undefined) {
      metrics.push({ label: t.metricTemperature, value: `${dto.summary.temperature}°C` });
    }

    return {
      id: dto.id,
      title: dto.name,
      subtitle: this.mapAquariumSubtitle(dto, t),
      status: this.mapHealthStatus(dto.healthStatus),
      statusLabel: this.mapHealthStatusLabel(dto.healthStatus, t),
      metrics,
      icon: 'water_drop',
      selected: false,
    };
  }

  private mapAquariumSubtitle(dto: DashboardAquariumDto, t: TranslationDictionary): string {
    const waterTypeLabel = this.mapWaterTypeLabel(dto.waterType, t);
    const volumeLabel = this.mapVolumeLabel(dto.volume, dto.volumeUnit);
    return `${waterTypeLabel} • ${volumeLabel}`;
  }

  private mapWaterTypeLabel(waterType: string, t: TranslationDictionary): string {
    const map: Record<string, string> = {
      FRESHWATER: t.waterTypeFreshwater,
      SALTWATER: t.waterTypeSaltwater,
      BRACKISH: t.waterTypeBrackish,
    };
    return map[waterType] ?? waterType;
  }

  private mapVolumeLabel(volume: number, unit: string): string {
    const unitLabel = unit === 'LITER' ? 'L' : unit === 'GALLON' ? 'gal' : unit;
    return `${volume}${unitLabel}`;
  }

  private mapHealthStatus(status: AquariumHealthStatus): InfoCardStatus {
    const map: Record<AquariumHealthStatus, InfoCardStatus> = {
      STABLE: 'stable',
      ATTENTION: 'attention',
      CRITICAL: 'critical',
      UNKNOWN: 'unknown',
    };
    return map[status] ?? 'unknown';
  }

  private mapHealthStatusLabel(status: AquariumHealthStatus, t: TranslationDictionary): string {
    const map: Record<AquariumHealthStatus, string> = {
      STABLE: t.statusStable,
      ATTENTION: t.statusAttention,
      CRITICAL: t.statusCritical,
      UNKNOWN: t.statusUnknown,
    };
    return map[status] ?? t.statusUnknown;
  }

  private mapWaterParameter(
    dto: WaterParameterDto,
    t: TranslationDictionary,
  ): WaterParameterCardViewModel {
    return {
      key: dto.key,
      name: dto.name,
      periodLabel: t.periodLastNDays.replace('{{n}}', String(dto.periodDays)),
      variation: this.mapVariation(dto.variation),
      hasChartData: dto.series.length > 0,
    };
  }

  private mapVariation(dto: WaterParameterVariationDto): {
    displayValue: string;
    direction: ParameterVariationDirection;
  } {
    const direction = this.mapVariationDirection(dto.direction);
    const sign = dto.direction === 'UP' ? '+' : dto.direction === 'DOWN' ? '-' : '';
    const displayValue = `${sign}${this.formatWithUnit(dto.value, dto.unit)}`;

    return { displayValue, direction };
  }

  private mapVariationDirection(direction: VariationDirection): ParameterVariationDirection {
    const map: Record<VariationDirection, ParameterVariationDirection> = {
      UP: 'up',
      DOWN: 'down',
      STABLE: 'stable',
      UNKNOWN: 'unknown',
    };
    return map[direction] ?? 'unknown';
  }

  private mapUnitSuffix(unit: MeasurementUnit): string {
    const map: Record<string, string> = {
      PH: 'pH',
      CELSIUS: '°C',
      PPM: 'ppm',
      MG_L: 'mg/L',
      DKH: 'dKH',
      DGH: 'dGH',
      NONE: '',
    };
    return map[unit] ?? '';
  }

  private formatWithUnit(value: number, unit: MeasurementUnit): string {
    const suffix = this.mapUnitSuffix(unit);
    if (!suffix) return String(value);
    const separator = unit === 'CELSIUS' ? '' : ' ';
    return `${value}${separator}${suffix}`;
  }

  private mapRecentMeasurement(
    dto: RecentMeasurementDto,
    t: TranslationDictionary,
  ): RecentMeasurementViewModel {
    const value = this.formatWithUnit(dto.value, dto.unit);

    return {
      id: dto.id,
      aquariumId: dto.aquariumId,
      parameterKey: dto.parameterKey,
      measuredAt: dto.measuredAt,
      title: dto.parameterName,
      subtitle: dto.aquariumName,
      value,
      metadata: this.formatTime(dto.measuredAt),
      badge: this.mapMeasurementBadge(dto.status, t),
    };
  }

  private mapMeasurementBadge(
    status: WaterParameterStatus,
    t: TranslationDictionary,
  ): InfoListItemBadge | null {
    const map: Record<WaterParameterStatus, { label: string; status: InfoListItemStatus } | null> =
      {
        NORMAL: { label: t.badgeNormal, status: 'normal' },
        ATTENTION: { label: t.badgeHigh, status: 'attention' },
        CRITICAL: { label: t.badgeCritical, status: 'danger' },
        UNKNOWN: null,
      };
    return map[status] ?? null;
  }

  private mapRecentApplication(dto: RecentApplicationDto): RecentApplicationViewModel {
    return {
      id: dto.id,
      aquariumId: dto.aquariumId,
      title: dto.productName,
      subtitle: dto.aquariumName,
      value: `${dto.dosage} ${dto.dosageUnit}`,
      metadata: this.formatTime(dto.appliedAt),
      badge: null,
    };
  }

  private formatTime(isoTimestamp: string): string {
    try {
      const date = new Date(isoTimestamp);
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return '';
    }
  }
}
