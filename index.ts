Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response('Hello, World!')
  },
})

console.log('✅ Server is running on http://localhost:3000')
