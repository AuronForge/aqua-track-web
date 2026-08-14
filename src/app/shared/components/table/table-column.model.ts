export type AqTableColumnAlignment = 'start' | 'center' | 'end';

export type AqTableColumnPriority = 'primary' | 'secondary' | 'optional';

export type AqTableRow = Record<string, unknown>;

export interface AqTableColumn<T extends AqTableRow = AqTableRow> {
  readonly key: string;
  readonly header: string;
  readonly property?: keyof T;
  readonly value?: (row: T) => unknown;
  readonly sortable?: boolean;
  readonly align?: AqTableColumnAlignment;
  readonly width?: string;
  readonly minWidth?: string;
  readonly ariaLabel?: string;
  readonly priority?: AqTableColumnPriority;
  readonly hidden?: boolean;
}
