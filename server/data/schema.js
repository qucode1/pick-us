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
    emailAttachment(attachmentId: String!, messageId: String!, userId: String): MessageAttachment
  }
  type sendEmailResponse {
    status: Int,
    statusText: String
  }
  type Message {
    id: String,
    threadId: String,
    messageDetails: MessageDetails,
    decoded: DecodedMessage
  }
  type DecodedMessage {
    id: String,
    to: String,
    from: String,
    subject: String,
    date: String,
    message: String,
    attachments: [DecodedAttachment]
  }
  type DecodedAttachment {
    fileName: String,
    mimeType: String,
    attachmentId: String
  }
  type MessageDetails {
    id: String,
    threadId: String,
    labelIds: [String],
    snippet: String,
    historyId: String,
    internalDate: String,
    payload: MessagePayload,
    sizeEstimate: Int,
    raw: String
  }
  type MessagePayload {
    partId: String,
    mimeType: String,
    filename: String,
    headers: [MessagePayloadHeader],
    body: MessageAttachment,
    parts: [MessagePayload]
  }
  type MessagePayloadHeader {
    name: String,
    value: String
  }
  type MessageAttachment {
    attachmentId: String,
    size: Int,
    data: String
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
    files: [File]
    messages: [DecodedMessage]
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
    files: [File]
    messages: [DecodedMessage]
  }
  type nearbyUser {
    distance: Float,
    user: User
  }
  type File {
    name: String
    link: String
    date: String
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
  type DriveFile {
    id: String!
  }
  input SortInput {
    category: String!
    order: Int!
  }
  input GmailQueryInput {
    email: String,
    includeSentEmails: Boolean,
    hasAttachment: Boolean,
    alternativeQuery: String,
    after: String
  }
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
  }
  input MessageInput {
    id: String!,
    to: String!,
    from: String!,
    subject: String!,
    date: String!,
    message: String!,
    attachments: [AttachmentInput]
  }
  input AttachmentInput {
    fileName: String!,
    mimeType: String!,
    attachmentId: String!
  }
  input FileInput {
    name: String!
    userId: String
    attachmentId: String!
    messageId: String!
    mimeType: String!
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
    addUser(input: UserInput!, location: LocationInput, files: [FileInput], messages: [MessageInput]): User
    updateMe(input: UserInput!, location: LocationInput): Me
    updateUser(id: String!, input: UserInput!, location: LocationInput, messages: [MessageInput]): User
    addJob(input: JobInput!, locations: [LocationInput!]!): Job
    uploadAttachmentToDrive(attachmentId: String!, messageId: String!, fileName: String!, mimeType: String!, userId: String): DriveFile
  }
`

const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = typeDefs
