export default interface IPagination<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: {
    url: null | string
    label: string
    active: boolean
  }[]
  next_page_url: string
  path: string
  per_page: number | null
  prev_page_url: number | null
  to: number
  total: number
}
