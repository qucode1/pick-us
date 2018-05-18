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

const { getMessageList, sendMessage } = require("../utils/gmail")

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
    async emails(_, args, ctx) {
      try {
        const messages = await getMessageList()
        console.log("emails resolver", messages.data.messages)
        return "success"
      } catch (err) {
        console.error("emails resolver", err)
        return "Failure"
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
    user(_, args, { profileToken, user }) {
      try {
        return isAdmin(user) ? User.findOne(args) : {}
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
          ? User.find()
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
    profileToken(user, args, { profileToken }) {
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
    async addUser(_, { input, location }, { idToken, profileToken, user }) {
      try {
        if (!idToken) return new AuthenticationError()
        // check for profileToken instead of user,
        // since user will always have at least email and auth0 as
        // long as there is an idToken
        if (profileToken && isAdmin(user)) {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            ...input
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
          return await user.save()
        } else return new AuthorizationError()
      } catch (error) {
        console.error("addUser mutation catched error", error)
        return new CustomError({
          message: "addUser mutation resolver error",
          data: {
            error
          }
        })
      }
    },
    async updateMe(_, { input, location }, { user }) {
      try {
        console.log("updateMe mutation resolver, input:", input)
        if (user && user._id) {
          await User.findByIdAndUpdate(user._id, {
            ...input,
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
          message: "updateUser mutation resolver error",
          data: {
            error
          }
        })
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
