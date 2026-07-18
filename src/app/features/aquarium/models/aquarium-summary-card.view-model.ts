import { InfoCardStatus } from '../../../shared/components/info-card/info-card-status.type';

export interface AquariumSummaryCardParameterViewModel {
  readonly key: 'ph' | 'temperature' | 'nitrate';
  readonly label: string;
  readonly icon: string;
  readonly value: string;
}

export interface AquariumSummaryCardViewModel {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly status: InfoCardStatus;
  readonly statusLabel: string;
  readonly volumeLabel: string;
  readonly installedLabel: string;
  readonly installedValue: string;
  readonly recentParameters: readonly AquariumSummaryCardParameterViewModel[];
}
