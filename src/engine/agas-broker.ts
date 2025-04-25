import { EventEmitter } from '@glandjs/emitter'
import type { ErrorData, RequestData, ResponseData } from '../common'

/**
 * AgasEvents - Event broker for HTTP request/response lifecycle
 * Provides a clean API for subscribing to and emitting events related to HTTP requests
 */
export class AgasEvents {
  private readonly emitter = new EventEmitter()

  constructor() {}

  onRequest(handler: (data: RequestData) => void) {
    return this.emitter.on('request:start', handler)
  }

  onResponse(handler: (data: ResponseData) => void) {
    return this.emitter.on('response:received', handler)
  }
  onError(handler: (data: ErrorData) => void) {
    return this.emitter.on('request:error', handler)
  }
  emitRequestStart(data: RequestData) {
    this.emitter.emit('request:start', data)
  }
  emitResponseReceived(data: ResponseData) {
    this.emitter.emit('response:received', data)
  }
  emitError(data: ErrorData) {
    this.emitter.emit('request:error', data)
  }
}
