const mongoose = require("mongoose")
const { User, Job, Location } = require("./mongodb")
var jwt = require("jsonwebtoken")
const jwksRsa = require("jwks-rsa")
const { GraphQLError } = require("graphql")
const { promisify } = require("util")
const {
  CustomError,
  NoUserDataError,
  AuthenticationError,
  AuthorizationError,
  DuplicateUserError
} = require("../utils/customErrors")

const { createProfileToken } = require("../utils/auth")
const {
  getMessageList,
  sendMessage,
  getMessage,
  getDecodedMessage,
  getAttachment,
  uploadFile,
  uploadAttachmentToDrive,
  uploadLocalFileToDrive
} = require("../utils/gmail")

const privateProfileKey = process.env.PRIVATEUSERKEY
const publicProfileKey = process.env.PUBLICUSERKEY

const isAdmin = user => (user ? user.role === "admin" : false)

// const aggregateLocations = (collection, lng, lat, distance, order) => {
//     let collectionSingular = collection
//     if (collection === "users" || "jobs") {
//         collectionSingular = collection.slice(0, -1)
//     }
//     return (Location.aggregate([
//         {
//             $geoNear: {
//                 near: {
//                     type: "Point",
//                     coordinates: [lng, lat]
//                 },
//                 spherical: true,
//                 distanceField: "dist.calculated",
//                 distanceMultiplier: 0.001,
//                 maxDistance: distance * 1000 || 10000,
//             }
//         },
//         {
//             $match: {
//                 category: `${collectionSingular}`
//             },
//         },
//         {
//             $group: { _id: `$${collectionSingular}`, distance: { $first: "$dist.calculated" } }
//         },
//         {
//             $sort: {
//                 "distance": (order && (order === 1 || order === -1) && order) || 1
//             }
//         },
//         {
//             $lookup: {
//                 from: collection,
//                 localField: "_id",
//                 foreignField: "_id",
//                 as: collectionSingular
//             }
//         }
//     ]))
// }

const resolvers = {
  Query: {
    async me(_, args, { user, idToken, profileToken }) {
      try {
        // console.log("resolver ctx user", user)
        // console.log("resolver ctx idToken", idToken)
        // console.log("resolver ctx profileToken", profileToken)
        if (!idToken) {
          const e = new AuthenticationError()
          return {}
        } else if (!profileToken) {
          console.log("me resolver ctx.user no profileToken")
          const newUser = new User({
            id: new mongoose.Types.ObjectId(),
            auth0: user.auth0,
            email: user.email
          })
          const duplicateUser = await User.findOne({
            email: user.email,
            role: { $exists: false }
          })
          if (duplicateUser) {
            newUser.role = "tempUser"
            await newUser.save()
            return newUser
          }
          newUser.role = "newUser"
          await newUser.save()
          return newUser
        } else return user
      } catch (err) {
        const e = new CustomError({
          message: "me query resolver error",
          data: {
            code: 400,
            error: err
          }
        })
        console.error("me resolver catched error", err)
        return e
      }
    },
    async emails(
      _,
      {
        userId = "yannick@qucode.eu",
        q: {
          email = "",
          hasAttachment = false,
          includeSentEmails = false,
          alternativeQuery = "",
          after = ""
        } = {}
      },
      ctx
    ) {
      try {
        hasAttachment = hasAttachment ? " has:attachment" : ""
        after = after
          ? " after:" +
            Date.parse(after)
              .toString()
              .slice(0, -3)
          : ""
        const defaultQuery = `(${email} from:info@qucode.eu to:info@qucode.eu in:anywhere${hasAttachment}${after}) OR (from:${email} in:anywhere${hasAttachment}${after})`
        const includeSentEmailsQuery = `(${email} from:info@qucode.eu to:info@qucode.eu in:anywhere${hasAttachment}${after}) OR (from:${email} in:anywhere${hasAttachment}${after}) OR (to:${email} in:sent${hasAttachment})`

        let query = ""
        switch (true) {
          case !!alternativeQuery:
            query = alternativeQuery
            break
          case includeSentEmails:
            query = includeSentEmailsQuery
            break
          case !!email:
            query = defaultQuery
            break
          default:
            query = defaultQuery
            break
        }
        const messages = await getMessageList(userId, query)
        return { ...messages.data, userId: userId }
      } catch (err) {
        console.error("emails resolver error", err)
        const e = new CustomError({
          message: "emails resolver error",
          data: {
            code: 400,
            error: err
          }
        })
        return e
      }
    },
    async emailAttachment(_, { attachmentId, messageId, userId }, ctx) {
      try {
        const attachment = await getAttachment({
          attachmentId,
          messageId,
          userId
        })
        return attachment.data
      } catch (err) {
        console.error(err)
        const e = new CustomError({
          message: "emailAttachment query resolver error",
          data: {
            code: 400,
            error: err
          }
        })
        return e
      }
    },
    async sendEmail(_, args, ctx) {
      try {
        const response = await sendMessage()
        return {
          status: response.status,
          statusText: response.statusText
        }
      } catch (err) {
        console.error("sendEmail resolver", err)
        return {
          status: err.response.status,
          statusText: err.response.statusText
        }
      }
    },
    async user(_, { id: _id, ...args }, { profileToken, user }) {
      try {
        return isAdmin(user) ? await User.findOne({ _id, ...args }) : {}
      } catch (err) {
        const e = new CustomError({
          message: "user query resolver error",
          data: {
            code: 400,
            error: err
          }
        })
        console.error("user query resolver error", err)
        return e
      }
    },
    async allUsers(
      _,
      { limit = 100, skip = 0, sort = { category: "createdAt", order: -1 } },
      { profileToken, user }
    ) {
      try {
        return isAdmin(user)
          ? await User.find()
              .sort({ [sort.category]: sort.order })
              .limit(limit)
              .skip(skip)
          : [{}]
      } catch (err) {
        const e = new CustomError({
          message: "allUsers query resolver error",
          data: {
            code: 400,
            error: err
          }
        })
        console.error("allUsers query resolver error", err)
        return e
      }
    }
    // job(_, args) {
    //     return Job.findOne(args);
    // },
    // jobs(_, args, ctx) {
    //     return Job.find(args)
    // },
    // allJobs() {
    //     return Job.find()
    // },
    // async nearbyJobs(_, { lng, lat, distance, order }, ctx) {
    //     try {
    //         const result = await aggregateLocations("jobs", lng, lat, distance, order).exec()
    //         return result.map(job => ({
    //             distance: job.distance,
    //             job: job.job[0]
    //         }))
    //     } catch (err) {
    //         console.error("nearbyJobs resolver catched error", err)
    //         return new Error(err.message)
    //     }
    // },
    // async nearbyUsers(_, { lng, lat, distance, order }, ctx) {
    //     try {
    //         const auth = await isAuthenticated(accessToken)
    //         if (!auth) return new Error("You are not authenticated")
    //         const userProfile = await isUser(auth.sub, profileToken)

    //         if (userProfile && isAdmin(userProfile)) {

    //             const result = await aggregateLocations("users", lng, lat, distance, order).exec()
    //             return result.map(user => ({
    //                 distance: user.distance,
    //                 user: user.user[0]
    //             }))
    //         } else {
    //             return new Error("You are not authorized to do this.")
    //         }
    //     } catch (err) {
    //         console.error("nearbyUsers resolver catched error", err);
    //         return new Error(err.message)
    //     }
    // }
  },
  Me: {
    id(user) {
      return user._id
    },
    async profileToken(_, args, { user, profileToken }) {
      const currentUser = await User.findById(user._id).lean()
      if (JSON.stringify(user) !== JSON.stringify(currentUser)) {
        const newProfileToken = createProfileToken(currentUser, {
          exp: Date.now() + 24 * 60 * 60 * 1000
        })
        return newProfileToken
      }
      return profileToken
    },
    publicKey() {
      return publicProfileKey
    }
  },
  User: {
    id(user) {
      return user._id
    }
  },
  EmailData: {
    messages(emailData, args, context, info) {
      return emailData.messages
        ? emailData.messages.map(message => ({
            ...message,
            userId: emailData.userId
          }))
        : []
    }
  },
  Message: {
    async messageDetails(message, args, context, info) {
      const result = await getMessage({ id: message.id })
      return { ...result.data, userId: message.userId }
    },
    decoded(obj, args, context, info) {
      return getDecodedMessage({ id: obj.id })
    }
  },
  MessageDetails: {
    payload(messageDetails, args, context, info) {
      return {
        ...messageDetails.payload,
        messageId: messageDetails.id,
        userId: messageDetails.userId
      }
    }
  },
  MessagePayload: {
    body(messagePayload, args, context, info) {
      return {
        ...messagePayload.body,
        messageId: messagePayload.messageId,
        userId: messagePayload.userId
      }
    },
    parts(messagePayload, args, context, info) {
      if (messagePayload.parts) {
        return messagePayload.parts.map(part => ({
          ...part,
          messageId: messagePayload.messageId,
          userId: messagePayload.userId
        }))
      }
    }
  },
  MessageAttachment: {
    async data({ data, attachmentId, messageId, userId }, args, context, info) {
      try {
        if (!attachmentId) return null
        if (data) return data
        const attachment = await getAttachment({
          attachmentId,
          messageId,
          userId
        })
        return attachment.data
      } catch (err) {
        console.error(err)
        const e = new CustomError({
          message: "MessageAttachment.data resolver error",
          data: {
            code: 400,
            error: err
          }
        })
        return e
      }
    }
  },
  // Job: {
  //     id(job) {
  //         return job._id
  //     }
  // },
  // Location: {
  //     id(location) {
  //         return location._id
  //     }
  // },
  // LocationRef: {
  //     async data(loc) {
  //         const result = await Location.findOne({ _id: loc.data })
  //         return result
  //     }
  // },
  Mutation: {
    async addUser(
      _,
      { input, location, files = [], localFiles = [], messages = [] },
      { idToken, profileToken, user }
    ) {
      try {
        // const { input, location, files, messages } = args
        if (!idToken) return new AuthenticationError()
        // check for profileToken instead of user,
        // since user will always have at least email and auth0 as
        // long as there is an idToken
        if (profileToken && isAdmin(user)) {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            ...input,
            messages
          })
          // const userLocation = await new Location({
          //     category: "user",
          //     user: user._id,
          //     loc: location
          // }).save()
          // user.location = {
          //     address: userLocation.loc.address,
          //     data: userLocation._id
          // }
          const savedFiles = await Promise.all(
            files.map(
              async ({
                name: fileName,
                userId,
                attachmentId,
                messageId,
                mimeType
              }) => {
                return await uploadAttachmentToDrive({
                  attachmentId,
                  messageId,
                  fileName,
                  mimeType,
                  userId
                })
              }
            )
          )
          user.files = savedFiles
          return await user.save()
        } else return new AuthorizationError()
      } catch (error) {
        const customError = new CustomError({
          message: "addUser mutation resolver error",
          data: {
            message: error.message,
            stack: error.stack
          }
        })
        return customError
      }
    },
    async updateMe(_, { input, location, messages }, { user }) {
      try {
        if (user && user._id) {
          await User.findByIdAndUpdate(user._id, {
            ...input,
            messages,
            auth0: user.auth0,
            role:
              ((user.role === "newUser" || user.role === "tempUser") &&
                Object.entries(input).every(([key, value]) => !!value) &&
                "user") ||
              user.role
          })
          return await User.findOne({ _id: user._id })
        } else return new AuthorizationError()
      } catch (error) {
        console.error(error)
        return new CustomError({
          message: "updateMe mutation resolver error",
          data: {
            error
          }
        })
      }
    },
    async updateUser(
      _,
      {
        id: _id,
        input,
        messages = [],
        savedFiles = [],
        newFiles = [],
        newLocalFiles = []
      },
      { user }
    ) {
      try {
        if (user && user._id) {
          let user = await User.findById(_id)

          user.firstName = input.firstName
          user.lastName = input.lastName
          user.email = input.email
          user.messages = messages

          const newSavedFiles = await Promise.all([
            ...newLocalFiles.map(async newLocalFile => {
              return await uploadLocalFileToDrive(newLocalFile)
            }),
            ...newFiles.map(
              async ({
                name: fileName,
                userId,
                attachmentId,
                messageId,
                mimeType
              }) => {
                return await uploadAttachmentToDrive({
                  attachmentId,
                  messageId,
                  fileName,
                  mimeType,
                  userId
                })
              }
            )
          ])
          user.files = [...newSavedFiles, ...savedFiles]
          return await user.save()
        } else return new AuthorizationError()
      } catch (error) {
        console.error(error)
        return new CustomError({
          message: "updateUser mutation resolver error",
          data: {
            error
          }
        })
      }
    },
    async uploadAttachmentToDrive(
      _,
      { attachmentId, messageId, fileName, mimeType, userId },
      ctx
    ) {
      try {
        const attachment = await getAttachment({
          attachmentId,
          messageId,
          userId
        })
        const result = await uploadFile({
          data: attachment.data.data,
          fileName,
          mimeType,
          id: attachmentId
        })
        return result.data
      } catch (err) {
        console.error(err)
        const e = new CustomError({
          message: "uploadAttachmentToDrive mutation resolver error",
          data: {
            code: 400,
            error: err
          }
        })
        return e
      }
    }
    // async createJob(_, { input, locations }, ctx) {
    //     try {
    //         const auth = await isAuthenticated(accessToken)
    //         if (!auth) return new Error("You are not authenticated")
    //         const userProfile = await isUser(auth.sub, profileToken)
    //         if (userProfile && isAdmin(userProfile)) {
    //             const job = new Job({
    //                 _id: new mongoose.Types.ObjectId(),
    //                 ...input,
    //                 locations: []
    //             })
    //             for (const loc of locations) {
    //                 const location = await new Location({
    //                     category: "job",
    //                     job: job._id,
    //                     loc
    //                 }).save()
    //                 job.locations.push({
    //                     address: location.loc.address,
    //                     data: location._id
    //                 })
    //             }
    //             return await job.save()
    //         } else return new Error("You are not authorized to do this.")
    //     } catch (err) {
    //         console.error("createJob mutation catched error", err);
    //         return new Error(err.message)
    //     }
    // }
  }
}

module.exports = resolvers
