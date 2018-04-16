require("dotenv").config()
const { GraphQLServer } = require("graphql-yoga")
const { Engine } = require("apollo-engine")
const compression = require("compression")
const jwt = require("jsonwebtoken")
const jwksRsa = require("jwks-rsa")
const { formatError } = require("apollo-errors")

const {
  verifyIdToken,
  findUserByAuthSub,
  createProfileToken
} = require("./utils/auth")

// const privateKey = process.env.PRIVATEUSERKEY
const publicKey = process.env.PUBLICUSERKEY

const typeDefs = require("./data/schema")
const resolvers = require("./data/resolvers")

const options = {
  port: parseInt(process.env.PORT, 10) || 4000,
  endpoint: "/graphql",
  tracing: true,
  cacheControl: true,
  formatError
}

const context = async ({ request: { headers } }) => {
  const ctx = {}
  if (headers.id_token && !headers.profile_token) {
    try {
      const decoded = await verifyIdToken(headers.id_token)
      decoded &&
        ((ctx.idToken = headers.id_token),
        (ctx.user = {
          auth0: decoded.sub,
          email: decoded.email
        }))
      const user = await findUserByAuthSub(decoded.sub)
      if (user) {
        const profileToken = await createProfileToken(user, decoded)
        ctx.profileToken = profileToken
      }
    } catch (err) {
      console.error("setting context on first login", err)
    }
  } else if (headers.profile_token && headers.id_token) {
    ctx.idToken = headers.id_token
    ctx.profileToken = headers.profile_token
    try {
      ctx.user = await jwt.verify(ctx.profileToken, publicKey)
    } catch (err) {
      console.error("setting context for logged in user", err)
    }
  }
  return ctx
}

const server = new GraphQLServer({ typeDefs, resolvers, context })

const engine = new Engine({
  engineConfig: { apiKey: process.env.ENGINEKEY },
  endpoint: "/graphql",
  graphqlPort: parseInt(process.env.PORT, 10) || 4000
})
engine.start()

server.express.use(compression())
server.express.use(engine.expressMiddleware())

server.start(options, () =>
  console.log("Server is running on localhost:" + options.port)
)
