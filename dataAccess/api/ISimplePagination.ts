export default interface ISimplePagination<T> {
  data: T[];
  pagination: {
    page: number;
    total_items: number;
    total_pages: number;
  }
}
