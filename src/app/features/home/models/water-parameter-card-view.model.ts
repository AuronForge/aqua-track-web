import { InfoListItemData } from '../../../shared/components/info-list/info-list-item-data.model';

export type ParameterVariationDirection = 'up' | 'down' | 'stable' | 'unknown';

export interface ParameterVariationViewModel {
  displayValue: string;
  direction: ParameterVariationDirection;
  icon: string;
  iconClass: string;
}

export interface WaterParameterCardViewModel {
  key: string;
  name: string;
  periodLabel: string;
  variation: ParameterVariationViewModel;
  hasChartData: boolean;
  seriesItems: InfoListItemData[];
}
