import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { Agas, AgasError } from '../src';

describe('Agas Client', () => {
  let server: any;
  const baseURL = 'http://localhost:3333';

  beforeAll(async () => {
    // Start test server
    server = Bun.serve({
      port: 3333,
      async fetch(request) {
        const url = new URL(request.url);

        // GET /users
        if (url.pathname === '/users' && request.method === 'GET') {
          return Response.json({
            users: [
              { id: 1, name: 'John Doe', email: 'john@example.com' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
            ]
          });
        }

        // GET /users/:id
        if (url.pathname.startsWith('/users/') && request.method === 'GET') {
          const id = parseInt(url.pathname.split('/')[2]!);
          return Response.json({
            id,
            name: 'User ' + id,
            email: `user${id}@example.com`
          });
        }

        // POST /users
        if (url.pathname === '/users' && request.method === 'POST') {
          const body = await request.json();
          return Response.json(
            { id: 3, ...body },
            { status: 201 }
          );
        }

        // PUT /users/:id
        if (url.pathname.startsWith('/users/') && request.method === 'PUT') {
          const id = parseInt(url.pathname.split('/')[2]!);
          const body = await request.json();
          return Response.json({ id, ...body });
        }

        // DELETE /users/:id
        if (url.pathname.startsWith('/users/') && request.method === 'DELETE') {
          return new Response(null, { status: 204 });
        }

        // GET /timeout (slow endpoint)
        if (url.pathname === '/timeout') {
          await Bun.sleep(200);
          return Response.json({ message: 'slow response' });
        }

        // GET /error
        if (url.pathname === '/error') {
          return Response.json(
            { error: 'Internal Server Error' },
            { status: 500 }
          );
        }

        // GET /query
        if (url.pathname === '/query') {
          const params = Object.fromEntries(url.searchParams);
          return Response.json({ params });
        }

        // GET /headers
        if (url.pathname === '/headers') {
          const headers: Record<string, string> = {};
          request.headers.forEach((value, key) => {
            headers[key] = value;
          });
          return Response.json({ headers });
        }

        return new Response('Not Found', { status: 404 });
      }
    });

    await Bun.sleep(100); // Wait for server to start
  });

  afterAll(() => {
    server.stop();
  });

  describe('Basic Requests', () => {
    test('GET request', async () => {
      const client = new Agas({ baseURL });
      const response = await client.get('/users');
      expect(response.status).toBe(200);
      expect(response.data.users).toBeArray();
      expect(response.data.users).toHaveLength(2);
      expect(response.duration).toBeGreaterThan(0);
    });

    test('POST request', async () => {
      const client = new Agas({ baseURL });
      const userData = { name: 'Alice', email: 'alice@example.com' };
      
      const response = await client.post('/users', userData);

      expect(response.status).toBe(201);
      expect(response.data).toMatchObject(userData);
      expect(response.data.id).toBe(3);
    });

    test('PUT request', async () => {
      const client = new Agas({ baseURL });
      const updateData = { name: 'Updated Name' };
      
      const response = await client.put('/users/1', updateData);

      expect(response.status).toBe(200);
      expect(response.data.name).toBe('Updated Name');
    });

    test('DELETE request', async () => {
      const client = new Agas({ baseURL });
      
      const response = await client.delete('/users/1');

      expect(response.status).toBe(204);
      expect(response.data).toBeNull();
    });
  });

  describe('Configuration', () => {
    test('baseURL configuration', async () => {
      const client = new Agas({ baseURL });
      const response = await client.get('/users');

      expect(response.request.url).toContain(baseURL);
    });

    test('default headers', async () => {
      const client = new Agas({
        baseURL,
        headers: {
          'X-Custom-Header': 'test-value'
        }
      });

      const response = await client.get('/headers');

      expect(response.data.headers['x-custom-header']).toBe('test-value');
    });

    test('request-specific headers override defaults', async () => {
      const client = new Agas({
        baseURL,
        headers: {
          'X-Default': 'default'
        }
      });

      const response = await client.get('/headers', {
        headers: {
          'X-Custom': 'custom'
        }
      });

      expect(response.data.headers['x-default']).toBe('default');
      expect(response.data.headers['x-custom']).toBe('custom');
    });

    test('timeout configuration', async () => {
      const client = new Agas({
        baseURL,
        timeout: 100
      });

      await expect(client.get('/timeout')).rejects.toThrow();
    });
  });

  describe('Query Parameters', () => {
    test('single query parameter', async () => {
      const client = new Agas({ baseURL });
      
      const response = await client.get('/query', {
        params: { page: 1 }
      });

      expect(response.data.params.page).toBe('1');
    });

    test('multiple query parameters', async () => {
      const client = new Agas({ baseURL });
      
      const response = await client.get('/query', {
        params: {
          page: 1,
          limit: 10,
          sort: 'name'
        }
      });

      expect(response.data.params).toMatchObject({
        page: '1',
        limit: '10',
        sort: 'name'
      });
    });

    test('array query parameters', async () => {
      const client = new Agas({ baseURL });
      
      const response = await client.get('/query', {
        params: {
          ids: [1, 2, 3]
        }
      });

      expect(response.data.params.ids).toBeDefined();
    });
  });

  describe('Interceptors', () => {
    test('request interceptor', async () => {
      const client = new Agas({ baseURL });
      let intercepted = false;

      client.interceptors.request.use((config) => {
        intercepted = true;
        config.headers['X-Intercepted'] = 'true';
        return config;
      });

      const response = await client.get('/headers');

      expect(intercepted).toBe(true);
      expect(response.data.headers['x-intercepted']).toBe('true');
    });

    test('response interceptor', async () => {
      const client = new Agas({ baseURL });
      let intercepted = false;

      client.interceptors.response.use((response) => {
        intercepted = true;
        response.data.intercepted = true;
        return response;
      });

      const response = await client.get('/users');

      expect(intercepted).toBe(true);
      expect(response.data.intercepted).toBe(true);
    });
  });

  describe('Events', () => {
    test('request event', async () => {
      const client = new Agas({ baseURL });
      let requestEmitted = false;

      client.on('request', () => {
        requestEmitted = true;
      });

      await client.get('/users');

      expect(requestEmitted).toBe(true);
    });

    test('response event', async () => {
      const client = new Agas({ baseURL });
      let responseEmitted = false;
      let responseData: any;

      client.on('response', (data) => {
        responseEmitted = true;
        responseData = data;
      });

      await client.get('/users');

      expect(responseEmitted).toBe(true);
      expect(responseData.status).toBe(200);
      expect(responseData.duration).toBeGreaterThan(0);
    });

    test('error event', async () => {
      const client = new Agas({
        baseURL,
        timeout: 50
      });
      let errorEmitted = false;

      client.on('error', () => {
        errorEmitted = true;
      });

      try {
        await client.get('/timeout');
      } catch (error) {
        // Expected
      }

      expect(errorEmitted).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('network error', async () => {
      const client = new Agas();

      await expect(
        client.get('http://localhost:9999/notexist')
      ).rejects.toThrow();
    });

    test('timeout error', async () => {
      const client = new Agas({
        baseURL,
        timeout: 50
      });

      await expect(client.get('/timeout')).rejects.toThrow();
    });

    test('HTTP error status', async () => {
      const client = new Agas({ baseURL });

      await expect(client.get('/error')).rejects.toThrow();
    });

    test('custom validateStatus', async () => {
      const client = new Agas({
        baseURL,
        validateStatus: (status) => status < 500
      });

      // Should not throw for 4xx
      const response = await client.get('/notfound');
      expect(response.status).toBe(404);
    });
  });

  describe('Response Types', () => {
    test('JSON response', async () => {
      const client = new Agas({ baseURL });
      
      const response = await client.get('/users', {
        responseType: 'json'
      });

      expect(typeof response.data).toBe('object');
    });

    test('text response', async () => {
      const client = new Agas({ baseURL });
      
      const response = await client.get('/users', {
        responseType: 'text'
      });

      expect(typeof response.data).toBe('string');
    });

    test('auto response type detection', async () => {
      const client = new Agas({ baseURL });
      
      const response = await client.get('/users', {
        responseType: 'auto'
      });

      // Should auto-detect JSON
      expect(typeof response.data).toBe('object');
    });
  });

  describe('Response Properties', () => {
    test('response contains all expected properties', async () => {
      const client = new Agas({ baseURL });
      
      const response = await client.get('/users');

      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('statusText');
      expect(response).toHaveProperty('headers');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('duration');
      expect(response).toHaveProperty('config');
      expect(response).toHaveProperty('request');
    });

    test('response timing', async () => {
      const client = new Agas({ baseURL });
      
      const response = await client.get('/users');

      expect(response.duration).toBeGreaterThan(0);
      expect(response.duration).toBeLessThan(1000);
    });
  });
});
