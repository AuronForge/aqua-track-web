export interface AqPaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AqPaginationChange {
  page: number;
  pageSize: number;
}

export interface AqPaginatorLabels {
  pageSize: string;
  page: string;
  of: string;
  noPages: string;
  items: string;
  loading: string;
  firstPage: string;
  previousPage: string;
  nextPage: string;
  lastPage: string;
}

export interface PaginatorChange {
  pageIndex: number;
  pageSize: number;
}
