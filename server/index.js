require("dotenv").config()
const { GraphQLServer } = require("graphql-yoga")
const { ApolloEngine } = require("apollo-engine")
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
const port = parseInt(process.env.PORT, 10) || 4000

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
        ctx.user = user
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

const engine = new ApolloEngine({
  apiKey: process.env.ENGINEKEY
})

const httpServer = server.createHttpServer({
  tracing: true,
  cacheControl: true,
  formatError,
  endpoint: "/graphql"
})

engine.listen(
  {
    port,
    httpServer,
    graphqlPaths: ["/graphql"]
  },
  () =>
    console.log(
      `Server with Apollo Engine is running on http://localhost:${port}`
    )
)
