import { Injectable, inject } from '@angular/core';

import { InfoCardStatus } from '../../../shared/components/info-card/info-card-status.type';
import { InfoListItemData } from '../../../shared/components/info-list/info-list-item-data.model';
import { InfoListItemBadge } from '../../../shared/components/info-list-item/info-list-item-badge.model';
import { InfoListItemStatus } from '../../../shared/components/info-list-item/info-list-item-status.type';
import { LanguageService } from '../../../shared/services/language.service';
import { TranslationDictionary } from '../../../shared/types/translation-dictionary.type';
import {
  AquariumHealthStatus,
  AquariumSummaryDto,
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
import { RecentApplicationViewModel } from '../models/recent-application-view.model';
import { RecentMeasurementViewModel } from '../models/recent-measurement-view.model';
import { SummaryParameterViewModel } from '../models/summary-parameter-view.model';
import {
  ParameterVariationDirection,
  ParameterVariationViewModel,
  WaterParameterCardViewModel,
} from '../models/water-parameter-card-view.model';

@Injectable({ providedIn: 'root' })
export class HomeDashboardMapper {
  private readonly languageService = inject(LanguageService);

  mapDashboardDtoToViewModel(dto: DashboardApiDto): HomeDashboardViewModel {
    const t = this.languageService.translation();
    const waterParametersByAquariumId: Record<string, WaterParameterCardViewModel[]> = {};
    const summaryParametersByAquariumId: Record<string, SummaryParameterViewModel[]> = {};

    for (const aq of dto.aquariums) {
      waterParametersByAquariumId[aq.id] = aq.waterParameters
        .filter((p) => p.isDisplayed)
        .map((p) => this.mapWaterParameter(p, t));
      summaryParametersByAquariumId[aq.id] = this.mapSummaryParameters(aq.summary, t);
    }

    return {
      aquariumCards: dto.aquariums.map((aq) => this.mapAquariumCard(aq, t)),
      selectedAquariumId: dto.aquariums[0]?.id ?? null,
      waterParametersByAquariumId,
      summaryParametersByAquariumId,
      recentMeasurements: dto.recentMeasurements.map((m) => this.mapRecentMeasurement(m, t)),
      recentApplications: dto.recentApplications.map((a) => this.mapRecentApplication(a)),
    };
  }

  private mapSummaryParameters(
    summary: AquariumSummaryDto,
    t: TranslationDictionary,
  ): SummaryParameterViewModel[] {
    return [
      {
        key: 'ph',
        name: t.metricPhLevel,
        value:
          summary.ph !== undefined ? this.formatWithUnit(summary.ph.value, summary.ph.unit) : '-',
        measuredAt: summary.ph !== undefined ? this.formatDateTime(summary.ph.measuredAt) : '',
      },
      {
        key: 'temperature',
        name: t.metricTemperature,
        value:
          summary.temperature !== undefined
            ? this.formatWithUnit(summary.temperature.value, summary.temperature.unit)
            : '- °C',
        measuredAt:
          summary.temperature !== undefined
            ? this.formatDateTime(summary.temperature.measuredAt)
            : '',
      },
    ];
  }

  private formatDateTime(isoTimestamp: string): string {
    try {
      return new Date(isoTimestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }

  private mapAquariumCard(
    dto: DashboardAquariumDto,
    t: TranslationDictionary,
  ): AquariumCardViewModel {
    const metrics = [
      {
        label: t.metricPhLevel,
        value: dto.summary.ph !== undefined ? dto.summary.ph.value.toFixed(1) : '-',
      },
      {
        label: t.metricTemperature,
        value:
          dto.summary.temperature !== undefined
            ? `${dto.summary.temperature.value.toFixed(1)}°C`
            : '- °C',
      },
    ];

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
      name: this.mapParameterName(dto.name, t),
      periodLabel: dto.periodLabel,
      variation: this.mapVariation(dto.variation),
      hasChartData: dto.series.length > 0,
      seriesItems: this.mapSeriesItems(dto.series, dto.unit, t),
    };
  }

  private mapSeriesItems(
    series: WaterParameterDto['series'],
    unit: MeasurementUnit,
    t: TranslationDictionary,
  ): InfoListItemData[] {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);
    const todayEnd = new Date(todayStart.getTime() + 86_400_000 - 1);

    return series
      .filter((point) => new Date(point.date) <= todayEnd)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((point) => ({
        title: this.formatSeriesDate(point.date, todayStart, yesterdayStart, t),
        value: this.formatWithUnit(point.value, unit),
      }));
  }

  private formatSeriesDate(
    dateStr: string,
    todayStart: Date,
    yesterdayStart: Date,
    t: TranslationDictionary,
  ): string {
    const date = new Date(dateStr);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (dayStart.getTime() === todayStart.getTime()) return t.seriesDateToday;
    if (dayStart.getTime() === yesterdayStart.getTime()) return t.seriesDateYesterday;

    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  }

  private mapParameterName(name: string, t: TranslationDictionary): string {
    const map: Record<string, string> = {
      pH: t.paramNamePh,
      gH: t.paramNameGh,
      kH: t.paramNameKh,
      Nitrate: t.paramNameNitrate,
      Nitrite: t.paramNameNitrite,
      Ammonia: t.paramNameAmmonia,
      Temperature: t.paramNameTemperature,
      TDS: t.paramNameTds,
      Copper: t.paramNameCopper,
      Phosphate: t.paramNamePhosphate,
      Iron: t.paramNameIron,
      CO2: t.paramNameCo2,
      O2: t.paramNameO2,
      Calcium: t.paramNameCalcium,
      Silicates: t.paramNameSilicates,
      'Density / Salinity': t.paramNameDensitySalinity,
      Magnesium: t.paramNameMagnesium,
      Iodine: t.paramNameIodine,
      Molybdenum: t.paramNameMolybdenum,
      Strontium: t.paramNameStrontium,
      Potassium: t.paramNamePotassium,
    };
    return map[name] ?? name;
  }

  private mapVariation(dto: WaterParameterVariationDto): ParameterVariationViewModel {
    const direction = this.mapVariationDirection(dto.direction);
    const sign = dto.direction === 'UP' ? '+' : dto.direction === 'DOWN' ? '-' : '';
    const displayValue = `${sign}${this.formatWithUnit(Math.abs(dto.value), dto.unit)}`;

    const iconMap: Record<ParameterVariationDirection, string> = {
      up: 'trending_up',
      down: 'trending_down',
      stable: 'trending_flat',
      unknown: '',
    };

    const iconClassMap: Record<ParameterVariationDirection, string> = {
      up: 'info-card__metric-icon--up',
      down: 'info-card__metric-icon--down',
      stable: '',
      unknown: '',
    };

    return {
      displayValue,
      direction,
      icon: iconMap[direction],
      iconClass: iconClassMap[direction],
    };
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
      SPECIFIC_GRAVITY: 'sg',
      NONE: '',
    };
    return map[unit] ?? '';
  }

  private mapDecimalPlaces(unit: MeasurementUnit): number {
    const oneDecimalUnits: MeasurementUnit[] = ['PH', 'CELSIUS', 'DKH', 'DGH'];
    return oneDecimalUnits.includes(unit) ? 1 : 2;
  }

  private formatWithUnit(value: number, unit: MeasurementUnit): string {
    const suffix = this.mapUnitSuffix(unit);
    const formatted = value.toFixed(this.mapDecimalPlaces(unit));
    if (!suffix) return formatted;
    const separator = unit === 'CELSIUS' ? '' : ' ';
    return `${formatted}${separator}${suffix}`;
  }

  private mapRecentMeasurement(
    dto: RecentMeasurementDto,
    t: TranslationDictionary,
  ): RecentMeasurementViewModel {
    return {
      id: dto.id,
      aquariumId: dto.aquariumId,
      parameterKey: dto.parameterKey,
      measuredAt: dto.measuredAt,
      title: this.mapParameterName(dto.waterParameterName, t),
      subtitle: dto.aquariumName,
      value: this.formatWithUnit(dto.value, dto.unit),
      metadata: this.formatTime(dto.measuredAt),
      badge: this.mapMeasurementBadge(dto.status, t),
    };
  }

  private mapRecentApplication(dto: RecentApplicationDto): RecentApplicationViewModel {
    return {
      id: dto.id,
      title: dto.productName,
      subtitle: dto.aquariumName,
      value: `${dto.amount} ${dto.unit}`,
      metadata: this.formatTime(dto.appliedAt),
      badge: null,
    };
  }

  private formatTime(isoTimestamp: string): string {
    try {
      return new Date(isoTimestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return '';
    }
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
}
