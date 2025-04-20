export type RequestData = {
  id: string
  method: string
  url: string
  headers?: Record<string, string>
  body?: string
  start: number
}

export type ResponseData = {
  id: string
  status: number
  body: string
  duration: number
}

export type ErrorData = {
  id: string
  error: Error
}

export type AgasEventMap = {
  'request:start': RequestData
  'response:received': ResponseData
  'request:error': ErrorData
}

export type Handler<K extends keyof AgasEventMap> = (
  data: AgasEventMap[K]
) => void
