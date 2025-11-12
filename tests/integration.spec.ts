
import { describe, test, expect } from 'bun:test';
import { Agas } from '../src';

describe('Integration Tests', () => {
  test('GitHub API', async () => {
    const client = new Agas({
      baseURL: 'https://api.github.com'
    });

    const response = await client.get('/users/octocat');

    expect(response.status).toBe(200);
    expect(response.data.login).toBe('octocat');
  });

  test('HTTPBin echo', async () => {
    const client = new Agas({
      baseURL: 'https://httpbin.org'
    });

    const testData = { hello: 'world' };
    const response = await client.post('/post', testData);

    expect(response.status).toBe(200);
    expect(response.data.json).toMatchObject(testData);
  });

  test('JSONPlaceholder', async () => {
    const client = new Agas({
      baseURL: 'https://jsonplaceholder.typicode.com'
    });

    const response = await client.get('/posts/1');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('title');
    expect(response.data).toHaveProperty('body');
  });
});
