export type ParameterVariationDirection = 'up' | 'down' | 'stable' | 'unknown';

export interface ParameterVariationViewModel {
  displayValue: string;
  direction: ParameterVariationDirection;
}

export interface WaterParameterCardViewModel {
  key: string;
  name: string;
  periodLabel: string;
  variation: ParameterVariationViewModel;
  hasChartData: boolean;
}
