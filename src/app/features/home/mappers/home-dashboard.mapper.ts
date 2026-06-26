import { Injectable } from '@angular/core';

import { InfoCardStatus } from '../../../shared/components/info-card/info-card-status.type';
import { InfoListItemBadge } from '../../../shared/components/info-list-item/info-list-item-badge.model';
import { InfoListItemStatus } from '../../../shared/components/info-list-item/info-list-item-status.type';
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
  mapDashboardDtoToViewModel(dto: DashboardApiDto): HomeDashboardViewModel {
    return {
      aquariumCards: dto.aquariums.map((aq) => this.mapAquariumCard(aq)),
      selectedAquariumId: dto.selectedAquarium?.id ?? dto.aquariums[0]?.id ?? null,
      waterParameters: dto.waterParameters.map((p) => this.mapWaterParameter(p)),
      recentMeasurements: dto.recentMeasurements.map((m) => this.mapRecentMeasurement(m)),
      recentApplications: dto.recentApplications.map((a) => this.mapRecentApplication(a)),
    };
  }

  private mapAquariumCard(dto: DashboardAquariumDto): AquariumCardViewModel {
    const metrics = [];
    if (dto.summary.ph !== undefined) {
      metrics.push({ label: 'Nível de pH', value: String(dto.summary.ph) });
    }
    if (dto.summary.temperature !== undefined) {
      metrics.push({ label: 'Temp', value: `${dto.summary.temperature}°C` });
    }

    return {
      id: dto.id,
      title: dto.name,
      subtitle: this.mapAquariumSubtitle(dto),
      status: this.mapHealthStatus(dto.healthStatus),
      statusLabel: this.mapHealthStatusLabel(dto.healthStatus),
      metrics,
      icon: 'water_drop',
      selected: false,
    };
  }

  private mapAquariumSubtitle(dto: DashboardAquariumDto): string {
    const waterTypeLabel = this.mapWaterTypeLabel(dto.waterType);
    const volumeLabel = this.mapVolumeLabel(dto.volume, dto.volumeUnit);
    return `${waterTypeLabel} • ${volumeLabel}`;
  }

  private mapWaterTypeLabel(waterType: string): string {
    const map: Record<string, string> = {
      FRESHWATER: 'Água Doce',
      SALTWATER: 'Água Salgada',
      BRACKISH: 'Salobra',
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

  private mapHealthStatusLabel(status: AquariumHealthStatus): string {
    const map: Record<AquariumHealthStatus, string> = {
      STABLE: 'Estável',
      ATTENTION: 'Atenção',
      CRITICAL: 'Crítico',
      UNKNOWN: 'Desconhecido',
    };
    return map[status] ?? 'Desconhecido';
  }

  private mapWaterParameter(dto: WaterParameterDto): WaterParameterCardViewModel {
    return {
      key: dto.key,
      name: dto.name,
      periodLabel: dto.periodLabel,
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

  private mapRecentMeasurement(dto: RecentMeasurementDto): RecentMeasurementViewModel {
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
      badge: this.mapMeasurementBadge(dto.status),
    };
  }

  private mapMeasurementBadge(status: WaterParameterStatus): InfoListItemBadge | null {
    const map: Record<WaterParameterStatus, { label: string; status: InfoListItemStatus } | null> =
      {
        NORMAL: { label: 'Normal', status: 'normal' },
        ATTENTION: { label: 'Alto', status: 'attention' },
        CRITICAL: { label: 'Crítico', status: 'danger' },
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
