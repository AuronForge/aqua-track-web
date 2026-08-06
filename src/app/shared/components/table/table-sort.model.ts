export type AqTableSortDirection = 'asc' | 'desc';

export interface AqTableSort {
  readonly key: string;
  readonly direction: AqTableSortDirection;
}
