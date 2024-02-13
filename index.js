const { TouhousInterface } = require('./touhous.js')
const path = require('node:path')
interface = new TouhousInterface()
const fastify = require('fastify')({
  logger: false
})
fastify.register(require('@fastify/static'), { //registering static file server
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
})

fastify.get('/', async (request, reply) => {
  return reply.sendFile('index.html', path.join(__dirname, 'html'))
})
fastify.get('/api', async (request, reply) => {
  return reply.sendFile('api.html', path.join(__dirname, 'html'))
})
fastify.get('/about', async (request, reply) => {
  return reply.sendFile('about.html', path.join(__dirname, 'html'))
})

fastify.get('/api/random', async (request, reply) => {
    return interface.getRandom()
})
fastify.get('/api/count', async (request, reply) => {
  return interface.getCount()
})

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 80 })
    console.log(`listening on http://localhost:${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()