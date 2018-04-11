require("dotenv").config()

const { GraphQLServer } = require('graphql-yoga')
const { Engine } = require('apollo-engine')
const compression = require('compression')
const jwt = require('jsonwebtoken')

// const privateKey = process.env.PRIVATEUSERKEY
const publicKey = process.env.PUBLICUSERKEY

const sampleItems = [
  { name: 'Apple' },
  { name: 'Banana' },
  { name: 'Orange' },
  { name: 'Melon' },
]

const typeDefs = require('./data/schema')
const resolvers = require('./data/resolvers')

const options = {
  port: parseInt(process.env.PORT, 10) || 4000,
  endpoint: "/graphql",
  tracing: true,
  cacheControl: true,
  formatError: error => {
    return {
      name: error.name,
      message: error.message
    }
  }
}

const context = async ({ request: { headers } }) => {
  const ctx = {}
  headers.access_token && (ctx.accessToken = headers.access_token)
  if (headers.profile_token && headers.access_token) {
    ctx.profileToken = headers.profile_token
    try {
      ctx.user = await jwt.verify(ctx.profile_token, publicKey)
    } catch (err) {
      console.error("ctx profileToken verification", err)
    }
  }
  return ctx
}

const server = new GraphQLServer({ typeDefs, resolvers, context })

const engine = new Engine({
  engineConfig: { apiKey: process.env.ENGINEKEY },
  endpoint: '/graphql',
  graphqlPort: parseInt(process.env.PORT, 10) || 4000
})
engine.start()

server.express.use(compression())
server.express.use(engine.expressMiddleware())

server.start(options, () => console.log('Server is running on localhost:' + options.port))
