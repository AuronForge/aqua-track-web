import { InfoCardStatus } from '../../../shared/components/info-card/info-card-status.type';
import { InfoCardMetric } from '../../../shared/components/info-card/info-card-metric.model';

export interface AquariumCardViewModel {
  id: string;
  title: string;
  subtitle: string;
  status: InfoCardStatus;
  statusLabel: string;
  metrics: InfoCardMetric[];
  icon: string;
  selected: boolean;
}
