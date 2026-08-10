import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';

import { BadgeColor } from '../../../shared/components/badge/badge-color.type';
import {
  AquariumDetailResponseDto,
  AquariumRecordStatus,
  AquariumWaterType,
} from '../models/aquarium-api.dto';
import {
  ApplicationQuery,
  AquariumApplicationDto,
  AquariumOverviewDto,
  CreateMeasurementRequestDto,
  LatestMeasurementDto,
  MeasurementDto,
  MeasurementQuery,
  MeasurementStatusDto,
  MeasurementTrendDto,
  WaterParameterDto,
} from '../models/aquarium-operational-api.dto';
import {
  AquariumDetailApplication,
  AquariumDetailMeasurement,
  AquariumDetailParameter,
  AquariumDetailViewModel,
  AquariumPaginationViewModel,
  AquariumWaterParameter,
} from '../models/aquarium-detail.model';
import { SystemValueApiDto } from '../models/system-value-api.dto';
import { AquariumApiService } from './aquarium-api.service';
import { SystemValuesApiService } from './system-values-api.service';

const EMPTY_PAGINATION: AquariumPaginationViewModel = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

const PARAMETER_META: Record<
  string,
  {
    readonly label: string;
    readonly shortLabel: string;
    readonly icon: string;
    readonly tone: AquariumDetailParameter['tone'];
  }
> = {
  ammonia: { label: 'Amônia', shortLabel: 'NH3/NH4', icon: 'science', tone: 'error' },
  calcium: { label: 'Cálcio', shortLabel: 'Ca', icon: 'science', tone: 'primary' },
  density_salinity: {
    label: 'Densidade / Salinidade',
    shortLabel: 'Densidade',
    icon: 'science',
    tone: 'information',
  },
  gh: { label: 'GH', shortLabel: 'GH', icon: 'waves', tone: 'information' },
  iron: { label: 'Ferro', shortLabel: 'Fe', icon: 'water_drop', tone: 'primary' },
  kh: { label: 'KH', shortLabel: 'KH', icon: 'waves', tone: 'information' },
  magnesium: { label: 'Magnésio', shortLabel: 'Mg', icon: 'science', tone: 'primary' },
  nitrate: { label: 'Nitrato', shortLabel: 'NO3', icon: 'water_drop', tone: 'success' },
  nitrite: { label: 'Nitrito', shortLabel: 'NO2', icon: 'water_drop', tone: 'error' },
  ph: { label: 'pH', shortLabel: 'pH', icon: 'science', tone: 'primary' },
  phosphate: { label: 'Fosfato', shortLabel: 'PO4', icon: 'science', tone: 'warning' },
  potassium: { label: 'Potássio', shortLabel: 'K', icon: 'water_drop', tone: 'success' },
  temperature: {
    label: 'Temperatura',
    shortLabel: 'Temp',
    icon: 'device_thermostat',
    tone: 'warning',
  },
};

const UNIT_LABELS: Record<string, string> = {
  CELSIUS: '°C',
  DGH: 'dGH',
  DKH: 'dKH',
  MG_L: 'mg/L',
  PH: '',
  PPM: 'ppm',
  SPECIFIC_GRAVITY: 'ppm',
};

@Injectable({
  providedIn: 'root',
})
export class AquariumDetailDataService {
  private readonly aquariumApiService = inject(AquariumApiService);
  private readonly systemValuesApiService = inject(SystemValuesApiService);

  getAquariumDetail(aquariumId: string): Observable<AquariumDetailViewModel | null> {
    return forkJoin({
      aquarium: this.aquariumApiService.getAquarium(aquariumId),
      overview: this.aquariumApiService.getAquariumOverview(aquariumId),
      waterParameters: this.aquariumApiService.listWaterParametersByAquarium(aquariumId),
      aquariumTypes: this.systemValuesApiService.listAquariumTypes(),
    }).pipe(
      map(({ aquarium, overview, waterParameters, aquariumTypes }) =>
        this.mapAquarium(aquarium, overview, waterParameters, aquariumTypes),
      ),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of(null);
        }

        return throwError(() => error);
      }),
    );
  }

  getAquariumOverview(aquariumId: string): Observable<{
    readonly summary: AquariumDetailViewModel['summary'];
    readonly parameters: readonly AquariumDetailParameter[];
  }> {
    return this.aquariumApiService.getAquariumOverview(aquariumId).pipe(
      map((overview) => ({
        summary: this.mapOverviewSummary(overview),
        parameters: this.mapLatestMeasurements(overview.latestMeasurements),
      })),
    );
  }

  listAquariumMeasurements(
    aquariumId: string,
    query: MeasurementQuery,
    waterParameters: readonly AquariumWaterParameter[],
  ): Observable<{
    readonly measurements: readonly AquariumDetailMeasurement[];
    readonly pagination: AquariumPaginationViewModel;
  }> {
    return this.aquariumApiService.listAquariumMeasurements(aquariumId, query).pipe(
      map((page) => ({
        measurements: page.data.map((measurement) =>
          this.mapMeasurement(measurement, waterParameters),
        ),
        pagination: page.pagination,
      })),
    );
  }

  createAquariumMeasurement(
    aquariumId: string,
    payload: CreateMeasurementRequestDto,
  ): Observable<void> {
    return this.aquariumApiService.createAquariumMeasurement(aquariumId, payload);
  }

  listAquariumApplications(
    aquariumId: string,
    query: ApplicationQuery,
  ): Observable<{
    readonly applications: readonly AquariumDetailApplication[];
    readonly pagination: AquariumPaginationViewModel;
  }> {
    return this.aquariumApiService.listAquariumApplications(aquariumId, query).pipe(
      map((page) => ({
        applications: page.data.map((application) => this.mapApplication(application)),
        pagination: page.pagination,
      })),
    );
  }

  private mapAquarium(
    aquarium: AquariumDetailResponseDto,
    overview: AquariumOverviewDto,
    waterParameters: readonly WaterParameterDto[],
    aquariumTypes: readonly SystemValueApiDto[],
  ): AquariumDetailViewModel {
    const waterTypeLabel = this.mapWaterType(aquarium.waterType);
    const volumeLabel = this.mapVolume(aquarium.volume, aquarium.volumeUnit);
    const setupDateLabel = this.formatDate(aquarium.setupDate);
    const status = this.mapStatus(aquarium.status);
    const overviewSummary = this.mapOverviewSummary(overview);

    return {
      id: aquarium.id,
      name: aquarium.name,
      typeLabel: this.mapAquariumType(aquarium.type, aquariumTypes),
      waterTypeLabel,
      volumeLabel,
      setupDateLabel,
      statusLabel: status.label,
      statusColor: status.color,
      heroImageUrl: aquarium.primaryPhotoUrl,
      heroAlt: `Foto do aquário ${aquarium.name}`,
      summary: {
        ...overviewSummary,
        capacityLabel: this.mapCapacityLabel(aquarium.volume, aquarium.volumeUnit),
        setupDateLabel,
      },
      waterParameters: waterParameters.map((parameter) => this.mapWaterParameter(parameter)),
      parameters: this.mapLatestMeasurements(overview.latestMeasurements),
      measurements: [],
      measurementsPagination: EMPTY_PAGINATION,
      applications: [],
      applicationsPagination: EMPTY_PAGINATION,
      aquaticLife: [],
    };
  }

  private mapAquariumType(type: string, aquariumTypes: readonly SystemValueApiDto[]): string {
    const matchedType = aquariumTypes.find((item) => item.systemValue === type);
    const fallbackLabels: Record<string, string> = {
      BREEDING: 'Reprodução',
      COMMUNITY: 'Comunitário',
      COMMUNITY_TANK: 'Aquário comunitário',
      HOSPITAL: 'Hospital',
      OTHER: 'Outro',
      PLANTED: 'Plantado',
      REEF_TANK: 'Recife',
      SPECIES_ONLY: 'Espécies específicas',
    };

    if (fallbackLabels[type]) {
      return fallbackLabels[type];
    }

    return matchedType?.displayValue ?? type;
  }

  private mapWaterType(waterType: AquariumWaterType): string {
    const labels: Record<AquariumWaterType, string> = {
      FRESHWATER: 'Água doce',
      SALTWATER: 'Água salgada',
      BRACKISH: 'Água salobra',
    };

    return labels[waterType] ?? waterType;
  }

  private mapOverviewSummary(overview: AquariumOverviewDto): AquariumDetailViewModel['summary'] {
    const status = this.mapHealthStatus(overview.health.status);

    return {
      capacityLabel: '',
      setupDateLabel: '',
      healthPercent: overview.health.score,
      healthScoreLabel: overview.health.score === null ? 'Sem dados' : `${overview.health.score}%`,
      healthStatus: status.status,
      healthStatusLabel: status.label,
      healthStatusColor: status.color,
    };
  }

  private mapLatestMeasurements(
    measurements: readonly LatestMeasurementDto[],
  ): readonly AquariumDetailParameter[] {
    return measurements.map((measurement) => {
      const key = measurement.parameter.toLocaleLowerCase('en-US');
      const status = this.mapMeasurementStatus(measurement.status);
      const trend = this.mapTrend(measurement.trend);
      const meta = this.parameterMeta(key, measurement.parameterName);

      return {
        key,
        label: meta.label,
        shortLabel: meta.shortLabel,
        icon: meta.icon,
        value: measurement.value,
        valueLabel: this.formatValue(measurement.value, measurement.unit),
        unit: this.formatUnit(measurement.unit),
        tone: meta.tone,
        measuredAt: measurement.measuredAt,
        statusLabel: status.label,
        statusColor: status.color,
        trend: trend.trend,
        trendIcon: trend.icon,
        trendLabel: trend.label,
      };
    });
  }

  private mapWaterParameter(parameter: WaterParameterDto): AquariumWaterParameter {
    return {
      id: parameter.id,
      key: parameter.key,
      name: parameter.name,
      category: parameter.category,
      defaultUnit: parameter.defaultUnit,
    };
  }

  private mapMeasurement(
    measurement: MeasurementDto,
    waterParameters: readonly AquariumWaterParameter[],
  ): AquariumDetailMeasurement {
    const measuredDate = new Date(measurement.measuredAt);
    const parameterKey = measurement.waterParameter.toLocaleLowerCase('en-US');
    const waterParameter = waterParameters.find((parameter) => parameter.key === parameterKey);
    const status = this.mapMeasurementStatus(measurement.status ?? 'UNKNOWN');
    const trend = this.mapTrend(measurement.trend ?? 'UNKNOWN');

    return {
      id: measurement.id,
      measuredAt: measurement.measuredAt,
      dateLabel: this.formatDateTimeDate(measuredDate),
      timeLabel: this.formatDateTimeTime(measuredDate),
      parameterKey,
      parameterLabel: this.parameterMeta(
        parameterKey,
        measurement.parameterName ?? waterParameter?.name ?? measurement.waterParameter,
      ).label,
      value: measurement.value,
      unit: this.formatUnit(measurement.unit),
      valueLabel: this.formatValue(measurement.value, measurement.unit),
      statusLabel: status.label,
      statusColor: status.color,
      trend: trend.trend,
      trendIcon: trend.icon,
      trendLabel: trend.label,
    };
  }

  private mapApplication(application: AquariumApplicationDto): AquariumDetailApplication {
    return {
      id: application.id,
      appliedAt: application.appliedAt,
      dateLabel: this.formatDateTimeDate(new Date(application.appliedAt)),
      productName: application.productName,
      productType: application.productType,
      doseLabel: this.formatValue(application.dose, application.doseUnit),
      notes: application.notes ?? '',
    };
  }

  private mapHealthStatus(status: AquariumOverviewDto['health']['status']): {
    status: AquariumDetailViewModel['summary']['healthStatus'];
    label: string;
    color: BadgeColor;
  } {
    const labels: Record<
      AquariumOverviewDto['health']['status'],
      {
        status: AquariumDetailViewModel['summary']['healthStatus'];
        label: string;
        color: BadgeColor;
      }
    > = {
      STABLE: { status: 'stable', label: 'Estável', color: 'success' },
      ATTENTION: { status: 'attention', label: 'Atenção', color: 'warning' },
      CRITICAL: { status: 'critical', label: 'Crítico', color: 'error' },
      UNKNOWN: { status: 'unknown', label: 'Sem dados', color: 'tertiary' },
    };

    return labels[status];
  }

  private mapMeasurementStatus(status: MeasurementStatusDto): {
    label: string;
    color: BadgeColor;
  } {
    const labels: Record<MeasurementStatusDto, { label: string; color: BadgeColor }> = {
      BELOW: { label: 'Abaixo', color: 'warning' },
      NORMAL: { label: 'Normal', color: 'success' },
      ABOVE: { label: 'Acima', color: 'warning' },
      UNKNOWN: { label: 'Sem classificação', color: 'tertiary' },
    };

    return labels[status];
  }

  private mapTrend(trend: MeasurementTrendDto): {
    trend: AquariumDetailMeasurement['trend'];
    icon: string;
    label: string;
  } {
    const map: Record<
      MeasurementTrendDto,
      { trend: AquariumDetailMeasurement['trend']; icon: string; label: string }
    > = {
      UP: { trend: 'up', icon: 'trending_up', label: 'Aumentando' },
      DOWN: { trend: 'down', icon: 'trending_down', label: 'Diminuindo' },
      STABLE: { trend: 'stable', icon: 'trending_flat', label: 'Estável' },
      UNKNOWN: { trend: 'unknown', icon: 'remove', label: 'Sem dados suficientes' },
    };

    return map[trend];
  }

  private mapStatus(status: AquariumRecordStatus): { label: string; color: BadgeColor } {
    const labels: Record<AquariumRecordStatus, { label: string; color: BadgeColor }> = {
      ACTIVE: { label: 'Ativo', color: 'success' },
      INACTIVE: { label: 'Inativo', color: 'warning' },
      ARCHIVED: { label: 'Arquivado', color: 'tertiary' },
    };

    return labels[status];
  }

  private mapVolume(volume: number, unit: AquariumDetailResponseDto['volumeUnit']): string {
    const unitLabel = unit === 'GALLON' ? 'gal' : 'L';
    return `${this.formatNumber(volume)}${unitLabel}`;
  }

  private mapCapacityLabel(volume: number, unit: AquariumDetailResponseDto['volumeUnit']): string {
    const formattedVolume = new Intl.NumberFormat('pt-BR', {
      maximumFractionDigits: 1,
    }).format(volume);
    let unitLabel = volume === 1 ? 'litro' : 'litros';

    if (unit === 'GALLON') {
      unitLabel = volume === 1 ? 'galão' : 'galões';
    }

    return `Capacidade total: ${formattedVolume} ${unitLabel}`;
  }

  private formatDate(date: string | null | undefined): string {
    if (!date) {
      return 'Data indisponível';
    }

    const dateOnly = date.slice(0, 10);
    const parsedDate = new Date(`${dateOnly}T12:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Data indisponível';
    }

    return parsedDate.toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private formatNumber(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  private formatValue(value: number, unit: string): string {
    const formatted = this.formatNumber(value);
    const unitLabel = this.formatUnit(unit);
    return unitLabel ? `${formatted} ${unitLabel}` : formatted;
  }

  private formatUnit(unit: string): string {
    return UNIT_LABELS[unit] ?? unit;
  }

  private formatDateTimeDate(date: Date): string {
    if (Number.isNaN(date.getTime())) {
      return 'Data indisponível';
    }

    return date.toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private formatDateTimeTime(date: Date): string {
    if (Number.isNaN(date.getTime())) {
      return '--:--';
    }

    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  private parameterMeta(
    key: string,
    label: string,
  ): {
    label: string;
    shortLabel: string;
    icon: string;
    tone: AquariumDetailParameter['tone'];
  } {
    return (
      PARAMETER_META[key] ?? {
        label,
        shortLabel: label,
        icon: 'science',
        tone: 'primary',
      }
    );
  }
}
