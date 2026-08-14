export interface AqTableColumn<T = unknown> {
  key: string;
  header: string;
  property?: keyof T & string;
  sortable?: boolean;
  minWidth?: string;
  priority?: 'primary' | 'secondary';
}

export interface AqTableEmptyState {
  title: string;
  description?: string;
  icon?: string;
}

export interface AqTableSort {
  key: string;
  direction: 'asc' | 'desc';
}
