import { expect, test, describe, beforeAll, afterAll } from 'bun:test'
import { RequestMethod } from '../src/common'
import { Agas } from '../dist'

describe('Agas Integration Tests', () => {
  let server: any
  const baseUrl = 'http://localhost:3000'
  beforeAll(async () => {
    server = Bun.serve({
      port: 3000,
      async fetch(request) {
        const url = new URL(request.url)

        if (url.pathname === '/api/users' && request.method === 'GET') {
          return new Response(
            JSON.stringify({ users: [{ id: 1, name: 'John' }] }),
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }

        if (
          url.pathname === '/api/users' &&
          (request.method === 'POST' ||
            request.method === 'DELETE' ||
            request.method === 'PUT' ||
            request.method === 'PATCH')
        ) {
          let body: any = {}

          if (request.headers.get('content-length') !== '0') {
            try {
              body = await request.json()
            } catch (err) {
              console.warn('Failed to parse JSON:', err)
            }
          }

          return new Response(JSON.stringify({ ...body, id: 1 }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201,
          })
        }

        if (url.pathname === '/api/timeout') {
          await new Promise((resolve) => setTimeout(resolve, 200))
          return new Response(JSON.stringify('Timeout response'), {
            headers: { 'Content-Type': 'application/json' },
          })
        }

        if (url.pathname === '/api/error') {
          return new Response('Internal Server Error', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
          })
        }

        if (url.pathname === '/api/empty') {
          return new Response(null, {
            status: 204,
          })
        }

        if (url.pathname === '/api/text') {
          return new Response(JSON.stringify('Plain text response'), {
            headers: { 'Content-Type': 'text/plain' },
          })
        }

        if (url.pathname === '/api/binary') {
          const buffer = new Uint8Array([0, 1, 2, 3, 4])
          return new Response(buffer, {
            headers: { 'Content-Type': 'application/octet-stream' },
          })
        }

        if (url.pathname === '/api/headers') {
          const headers: Record<string, string> = {}
          request.headers.forEach((value, key) => {
            headers[key] = value
          })
          return new Response(JSON.stringify({ headers }), {
            headers: { 'Content-Type': 'application/json' },
          })
        }

        if (url.pathname === '/api/query') {
          const params: Record<string, string> = {}
          url.searchParams.forEach((value, key) => {
            params[key] = value
          })

          return new Response(JSON.stringify({ params }), {
            headers: { 'Content-Type': 'application/json' },
          })
        }

        return new Response(JSON.stringify('Not Found'), { status: 404 })
      },
    })
  })

  afterAll(() => {
    server.stop()
  })

  describe('Basic HTTP Methods', () => {
    test('GET request works correctly', async () => {
      const agas = new Agas()
      const response = await agas.request(`${baseUrl}/api/users`, {
        method: RequestMethod.GET,
      })

      expect(response.status).toBe(200)
      expect(response.ok).toBe(true)
      expect(response.data).toEqual({ users: [{ id: 1, name: 'John' }] })
    })

    test('POST request with JSON body', async () => {
      const agas = new Agas()
      const userData = { name: 'Alice', email: 'alice@example.com' }

      const response = await agas.request(`${baseUrl}/api/users`, {
        method: RequestMethod.POST,
        body: userData,
      })

      expect(response.status).toBe(201)
      expect(response.data).toEqual({ ...userData, id: 1 })
    })

    test('PUT, PATCH, DELETE methods work correctly', async () => {
      const agas = new Agas()

      const putResponse = await agas.put(`${baseUrl}/api/users`, {
        name: 'Updated',
      })
      expect(putResponse.data).toHaveProperty('name', 'Updated')

      const patchResponse = await agas.patch(`${baseUrl}/api/users`, {
        name: 'Patched',
      })
      expect(patchResponse.data).toHaveProperty('name', 'Patched')

      const deleteResponse = await agas.delete(`${baseUrl}/api/users`)
      expect(deleteResponse.status).toBeLessThan(400)
    })
  })

  describe('Timeout Handling', () => {
    test('Request times out when exceeding timeout limit', async () => {
      const agas = new Agas()

      try {
        await agas.request(`${baseUrl}/api/timeout`, {
          timeout: 100,
        })
        expect(false).toBe(true)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.name).toBe('TimeoutError')
      }
    })

    test('Request succeeds with sufficient timeout', async () => {
      const agas = new Agas()

      const response = await agas.request(`${baseUrl}/api/timeout`, {
        timeout: 300,
      })

      expect(response.status).toBe(200)
      expect(response.data).toBe('Timeout response')
    })
  })

  describe('Error Handling', () => {
    test('Handles server errors correctly', async () => {
      const agas = new Agas()

      const response = await agas.request(`${baseUrl}/api/error`)

      expect(response.status).toBe(500)
      expect(response.ok).toBe(false)
      expect(response.data).toBe('Internal Server Error')
    })

    test('Handles 404 errors', async () => {
      const agas = new Agas()

      const response = await agas.request(`${baseUrl}/non-existent-endpoint`)

      expect(response.status).toBe(404)
      expect(response.ok).toBe(false)
    })

    test('Enhances network errors with context', async () => {
      const agas = new Agas()

      try {
        await agas.request('https://non-existent-domain.xyz')
        expect(false).toBe(true)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.context).toBeDefined()
        expect(error.context.url).toBe('https://non-existent-domain.xyz')
        expect(error.context.method).toBe('GET')
        expect(error.context.requestId).toBeDefined()
      }
    })
  })

  describe('Response Formats', () => {
    test('Handles empty responses (204)', async () => {
      const agas = new Agas()

      const response = await agas.request(`${baseUrl}/api/empty`)

      expect(response.status).toBe(204)
      expect(response.data).toBeNull()
    })

    test('Parses JSON responses', async () => {
      const agas = new Agas()

      const response = await agas.request(`${baseUrl}/api/users`)

      expect(response.data).toBeObject()
      expect(response.data.users).toBeArray()
    })

    test('Handles text responses with responseType', async () => {
      const agas = new Agas()

      const response = await agas.request(`${baseUrl}/api/text`, {
        responseType: 'text',
      })
      expect(response.data).toBe('"Plain text response"')
      expect(typeof response.data).toBe('string')
    })

    test('Handles binary responses with arrayBuffer responseType', async () => {
      const agas = new Agas()

      const response = await agas.request(`${baseUrl}/api/binary`, {
        responseType: 'arrayBuffer',
      })

      expect(response.data).toBeInstanceOf(ArrayBuffer)
      const view = new Uint8Array(response.data)
      expect(Array.from(view.slice(0, 5))).toEqual([0, 1, 2, 3, 4])
    })

    test('Handles blob responseType', async () => {
      const agas = new Agas()

      const response = await agas.request(`${baseUrl}/api/binary`, {
        responseType: 'blob',
      })

      expect(response.data).toBeInstanceOf(Blob)
      expect(response.data.type).toBe('application/octet-stream')
    })
  })

  // Headers tests
  describe('Headers Handling', () => {
    test('Sends custom headers correctly', async () => {
      const agas = new Agas()

      const customHeaders = {
        'X-Custom-Header': 'test-value',
        Authorization: 'Bearer test-token',
      }

      const response = await agas.request(`${baseUrl}/api/headers`, {
        headers: customHeaders,
      })

      expect(response.data.headers).toHaveProperty(
        'x-custom-header',
        'test-value'
      )
      expect(response.data.headers).toHaveProperty(
        'authorization',
        'Bearer test-token'
      )
    })

    test('Does not override custom Content-Type', async () => {
      const agas = new Agas()
      const response = await agas.request(`${baseUrl}/api/headers`, {
        method: RequestMethod.POST,
        headers: {
          'Content-Type': 'application/custom+json',
        },
        body: { test: 'data' },
      })

      expect(response.data.headers).toHaveProperty(
        'content-type',
        'application/custom+json'
      )
    })
    test('Handles Headers instance correctly', async () => {
      const agas = new Agas()

      const headers = new Headers()
      headers.append('X-Custom-Header', 'test-value')

      const response = await agas.request(`${baseUrl}/api/headers`, {
        headers: headers as any,
      })

      expect(response.data.headers).toHaveProperty(
        'x-custom-header',
        'test-value'
      )
    })
  })

  describe('Query Parameters', () => {
    test('Appends query parameters correctly', async () => {
      const agas = new Agas()

      const params = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
      }

      const response = await agas.request(`${baseUrl}/api/query`, {
        params,
      })

      expect(response.data.params).toEqual({
        page: '1',
        limit: '10',
        sort: 'createdAt',
      })
    })

    test('Handles array query parameters', async () => {
      const agas = new Agas()

      const params = {
        ids: [1, 2, 3],
        tags: ['important', 'urgent'],
      }

      const response = await agas.request(`${baseUrl}/api/query`, {
        params,
      })

      expect(response.data.params).toHaveProperty('ids')
      expect(response.data.params).toHaveProperty('tags')
    })

    test('Filters out null and undefined query parameters', async () => {
      const agas = new Agas()

      const params = {
        defined: 'value',
        nullParam: null,
        undefinedParam: undefined,
      }

      const response = await agas.request(`${baseUrl}/api/query`, {
        params,
      })

      expect(response.data.params).toHaveProperty('defined', 'value')
      expect(response.data.params).not.toHaveProperty('nullParam')
      expect(response.data.params).not.toHaveProperty('undefinedParam')
    })

    test('Appends to existing query string', async () => {
      const agas = new Agas()

      const response = await agas.request(
        `${baseUrl}/api/query?existing=param`,
        {
          params: {
            additional: 'value',
          },
        }
      )

      expect(response.data.params).toHaveProperty('existing', 'param')
      expect(response.data.params).toHaveProperty('additional', 'value')
    })
  })

  describe('Event Handling', () => {
    test('Emits and captures request events', async () => {
      const agas = new Agas()
      let requestCaptured = false
      let responseCaptured = false

      agas.onRequest(() => {
        requestCaptured = true
      })

      agas.onResponse(() => {
        responseCaptured = true
      })

      await agas.get(`${baseUrl}/api/users`)

      expect(requestCaptured).toBe(true)
      expect(responseCaptured).toBe(true)
    })

    test('Captures error events', async () => {
      const agas = new Agas()
      let errorCaptured = false
      let errorData

      agas.onError((data) => {
        errorCaptured = true
        errorData = data
      })

      try {
        await agas.request('https://non-existent-domain.xyz')
      } catch (e) {
        // Expected to fail
      }

      expect(errorCaptured).toBe(true)
      expect(errorData).toBeDefined()
      expect(errorData!.error).toBeInstanceOf(Error)
    })

    test('Records and reports request duration', async () => {
      const agas = new Agas()
      let responseDuration

      agas.onResponse((data) => {
        responseDuration = data.duration
      })

      const response = await agas.get(`${baseUrl}/api/users`)

      expect(response.duration).toBeGreaterThan(0)
      expect(responseDuration).toBeGreaterThan(0)
    })
  })

  describe('Utils', () => {
    test('Handles FormData bodies correctly', async () => {
      const agas = new Agas()
      const formData = new FormData()
      formData.append('file', new Blob(['test content']), 'test.txt')
      formData.append('field', 'value')

      const requestId = 'form-data-test'

      let requestBodyType: string | undefined
      agas.onRequest((data) => {
        if (data.id === requestId) {
          requestBodyType = typeof data.body
        }
      })

      await agas.request(`${baseUrl}/api/users`, {
        method: RequestMethod.POST,
        body: formData,
        requestId,
      })

      expect(requestBodyType).toBe('string')
    })
  })
})
