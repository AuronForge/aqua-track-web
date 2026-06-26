import { InfoListItemData } from '../../../shared/components/info-list/info-list-item-data.model';

export type RecentMeasurementViewModel = InfoListItemData & {
  id: string;
  aquariumId: string;
  parameterKey: string;
  measuredAt: string;
};
