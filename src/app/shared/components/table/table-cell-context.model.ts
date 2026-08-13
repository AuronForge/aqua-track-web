import { AqTableColumn, AqTableRow } from './table-column.model';

export interface AqTableCellContext<T extends AqTableRow = AqTableRow> {
  readonly $implicit: T;
  readonly row: T;
  readonly column: AqTableColumn<T>;
  readonly value: unknown;
  readonly index: number;
}
