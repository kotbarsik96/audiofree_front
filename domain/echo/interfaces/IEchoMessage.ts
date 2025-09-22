export interface IEchoMessage<T = any> {
  event: string
  data: T
}
