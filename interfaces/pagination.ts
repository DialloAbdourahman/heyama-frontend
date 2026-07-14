export interface IPagination<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
