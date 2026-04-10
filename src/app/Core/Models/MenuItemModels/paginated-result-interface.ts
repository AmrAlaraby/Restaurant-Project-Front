export interface PaginatedResultInterface<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

