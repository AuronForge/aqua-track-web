import { AquariumCardViewModel } from './aquarium-card-view.model';
import { WaterParameterCardViewModel } from './water-parameter-card-view.model';
import { SummaryParameterViewModel } from './summary-parameter-view.model';
import { RecentMeasurementViewModel } from './recent-measurement-view.model';
import { RecentApplicationViewModel } from './recent-application-view.model';

export interface HomeDashboardViewModel {
  aquariumCards: AquariumCardViewModel[];
  selectedAquariumId: string | null;
  waterParametersByAquariumId: Record<string, WaterParameterCardViewModel[]>;
  summaryParametersByAquariumId: Record<string, SummaryParameterViewModel[]>;
  recentMeasurements: RecentMeasurementViewModel[];
  recentApplications: RecentApplicationViewModel[];
}
