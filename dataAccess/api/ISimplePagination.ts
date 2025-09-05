export default interface ISimplePagination<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_items: number;
    total_pages: number;
    per_page: number;
  }
}
