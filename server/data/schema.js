const { makeExecutableSchema } = require("graphql-tools")
const resolvers = require("./resolvers")

const typeDefs = `
  type Query {
    me: Me
    user(id: String, firstName: String, lastName: String, email: String, auth0: String): User
    allUsers(limit: Int, skip: Int, sort: SortInput): [User]
    job(id: String): Job
    jobs(title: String, location: String): [Job]
    allJobs: [Job]
    nearbyJobs(lng: Float!, lat: Float!, distance: Int, order: Int): [nearbyJob]
    nearbyUsers(lng: Float!, lat: Float!, distance: Int, order: Int): [nearbyUser]
    emails(userId: String, q: GmailQueryInput): EmailData
    sendEmail: sendEmailResponse
  }
  type sendEmailResponse {
    status: Int,
    statusText: String
  }
  type Message {
    id: String,
    threadId: String
  }
  type EmailData {
    messages: [Message],
    nextPageToken: String,
    resultSizeEstimate: Int
  }
  type Me {
    id: String
    firstName: String
    lastName: String
    email: String
    auth0: String
    role: String
    location: LocationRef
    profileToken: String
    publicKey: String
  }
  type User {
    id: String
    firstName: String
    lastName: String
    email: String
    auth0: String
    role: String
    location: LocationRef
  }
  type nearbyUser {
    distance: Float,
    user: User
  }
  type Job {
    id: String
    title: String
    description: String
    locations: [LocationRef]
  }
  type nearbyJob {
    distance: Float,
    job: Job
  }
  type Loc {
    type: String
    coordinates: [Float]
    address: String
  }
  type Location {
    id: String
    category: String
    user: String
    job: String
    loc: Loc
  }
  type LocationRef {
    address: String
    data: Location
  }
  input SortInput {
    category: String!
    order: Int!
  }
  input GmailQueryInput {
    email: String,
    includeSentEmails: Boolean,
    hasAttachment: Boolean,
    alternativeQuery: String
  }
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
  }
  input LocationInput {
    coordinates: [Float!]!
    address: String!
  }
  input JobInput {
    title: String!
    description: String!
  }
  type Mutation {
    addUser(input: UserInput!, location: LocationInput): User
    updateMe(input: UserInput!, location: LocationInput): Me
    addJob(input: JobInput!, locations: [LocationInput!]!): Job
  }
`

const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = typeDefs
