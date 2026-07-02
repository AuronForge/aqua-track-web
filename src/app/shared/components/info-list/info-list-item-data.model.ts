import { InfoListItemBadge } from '../info-list-item/info-list-item-badge.model';

export interface InfoListItemData {
  title: string;
  subtitle?: string;
  value: string;
  metadata?: string;
  badge?: InfoListItemBadge | null;
}
