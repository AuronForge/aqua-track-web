import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

import { BadgeColor } from '../../../shared/components/badge/badge-color.type';
import {
  AquariumAlertParameterPreference,
  AquariumListResponseDto,
  AquariumRecordStatus,
  AquariumWaterType,
} from '../models/aquarium-api.dto';
import { AquariumDetailViewModel } from '../models/aquarium-detail.model';
import { SystemValueApiDto } from '../models/system-value-api.dto';
import { DEFAULT_AQUARIUM_DETAIL_DEMO_DATA } from '../mocks/aquarium-detail.mock';
import { AquariumApiService } from './aquarium-api.service';
import { SystemValuesApiService } from './system-values-api.service';

@Injectable({
  providedIn: 'root',
})
export class AquariumDetailDataService {
  private readonly aquariumApiService = inject(AquariumApiService);
  private readonly systemValuesApiService = inject(SystemValuesApiService);

  getAquariumDetail(aquariumId: string): Observable<AquariumDetailViewModel | null> {
    return forkJoin({
      aquariums: this.aquariumApiService.listAquariums(),
      aquariumTypes: this.systemValuesApiService.listAquariumTypes(),
    }).pipe(
      map(({ aquariums, aquariumTypes }) => {
        const aquarium = aquariums.find((item) => item.id === aquariumId);

        return aquarium ? this.mapAquarium(aquarium, aquariumTypes) : null;
      }),
    );
  }

  private mapAquarium(
    aquarium: AquariumListResponseDto,
    aquariumTypes: readonly SystemValueApiDto[],
  ): AquariumDetailViewModel {
    const waterTypeLabel = this.mapWaterType(aquarium.waterType);
    const volumeLabel = this.mapVolume(aquarium.volume, aquarium.volumeUnit);
    const setupDateLabel = this.formatDate(aquarium.setupDate);
    const status = this.mapStatus(aquarium.status);
    const parameters = this.filterParameters(aquarium);

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
        capacityLabel: this.mapCapacityLabel(aquarium.volume, aquarium.volumeUnit),
        setupDateLabel,
        healthPercent: DEFAULT_AQUARIUM_DETAIL_DEMO_DATA.healthPercent,
      },
      parameters,
      measurements: DEFAULT_AQUARIUM_DETAIL_DEMO_DATA.measurements,
      applications: DEFAULT_AQUARIUM_DETAIL_DEMO_DATA.applications,
      aquaticLife: DEFAULT_AQUARIUM_DETAIL_DEMO_DATA.aquaticLife,
    };
  }

  private filterParameters(aquarium: AquariumListResponseDto) {
    const displayPreferences = aquarium.displayPreferences;
    const alertParameterKeys = Object.entries(aquarium.alertParameters)
      .filter(([, value]) => this.isAlertConfigured(value))
      .map(([key]) => this.normalizeParameterKey(key));
    const displayedKeys = Object.entries(displayPreferences)
      .filter(([, enabled]) => enabled)
      .map(([key]) => this.normalizeParameterKey(key));
    const enabledKeys = new Set([...displayedKeys, ...alertParameterKeys]);
    const filtered = DEFAULT_AQUARIUM_DETAIL_DEMO_DATA.parameters.filter(
      (parameter) => enabledKeys.size === 0 || enabledKeys.has(parameter.key),
    );

    return filtered.length > 0 ? filtered : DEFAULT_AQUARIUM_DETAIL_DEMO_DATA.parameters;
  }

  private isAlertConfigured(value: AquariumAlertParameterPreference): boolean {
    return value !== false;
  }

  private normalizeParameterKey(key: string): string {
    return key
      .replace(/^display/i, '')
      .replace(/PH$/, 'ph')
      .replace(/TDS$/, 'tds')
      .replace(/CO2$/, 'co2')
      .replace(/O2$/, 'o2')
      .replace(/^[A-Z]/, (firstLetter) => firstLetter.toLocaleLowerCase('en-US'))
      .toLocaleLowerCase('en-US');
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

  private mapStatus(status: AquariumRecordStatus): { label: string; color: BadgeColor } {
    const labels: Record<AquariumRecordStatus, { label: string; color: BadgeColor }> = {
      ACTIVE: { label: 'Estável', color: 'success' },
      INACTIVE: { label: 'Atenção', color: 'warning' },
      ARCHIVED: { label: 'Arquivado', color: 'tertiary' },
    };

    return labels[status];
  }

  private mapVolume(volume: number, unit: AquariumListResponseDto['volumeUnit']): string {
    const unitLabel = unit === 'GALLON' ? 'gal' : 'L';
    return `${this.formatNumber(volume)}${unitLabel}`;
  }

  private mapCapacityLabel(volume: number, unit: AquariumListResponseDto['volumeUnit']): string {
    const formattedVolume = new Intl.NumberFormat('pt-BR', {
      maximumFractionDigits: 1,
    }).format(volume);
    let unitLabel = volume === 1 ? 'litro' : 'litros';

    if (unit === 'GALLON') {
      unitLabel = volume === 1 ? 'galão' : 'galões';
    }

    return `Capacidade total: ${formattedVolume} ${unitLabel}`;
  }

  private formatDate(date: string): string {
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
}
