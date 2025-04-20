import { Broker } from '@glandjs/events'
import type { ErrorData, RequestData, ResponseData } from '../common'

/**
 * AgasEvents - Event broker for HTTP request/response lifecycle
 * Provides a clean API for subscribing to and emitting events related to HTTP requests
 */
export class AgasEvents {
  private readonly broker: Broker = new Broker('agas')

  constructor() {}

  onRequest(handler: (data: RequestData) => void) {
    return this.broker.on('request:start', handler)
  }

  onResponse(handler: (data: ResponseData) => void) {
    return this.broker.on('response:received', handler)
  }
  onError(handler: (data: ErrorData) => void) {
    return this.broker.on('request:error', handler)
  }
  emitRequestStart(data: RequestData) {
    this.broker.emit('request:start', data, { queue: true })
  }
  emitResponseReceived(data: ResponseData) {
    this.broker.emit('response:received', data, { queue: true })
  }
  emitError(data: ErrorData) {
    this.broker.emit('request:error', data, { queue: true })
  }
}
