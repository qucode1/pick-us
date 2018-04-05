require("dotenv").config()

const { GraphQLServer } = require('graphql-yoga')
const { Engine } = require('apollo-engine')
const compression = require('compression')

const sampleItems = [
  { name: 'Apple' },
  { name: 'Banana' },
  { name: 'Orange' },
  { name: 'Melon' },
]

const typeDefs = `
  type Query {
    items: [Item!]!
  }

  type Item {
    name: String!
  }
`

const resolvers = {
  Query: {
    items: () => sampleItems,
  },
}

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

const context = async ({ request }) => {
  return {
    accessToken: request.headers.access_token || "",
    profileToken: request.headers.profile_token || ""
  }
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
