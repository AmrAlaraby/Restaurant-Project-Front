export interface PaginatedResult<T> {
  data: T[];
  pageIndex: number;
  pageSize: number;
  count: number;
}
