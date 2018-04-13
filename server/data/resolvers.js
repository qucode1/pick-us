const mongoose = require("mongoose")
const { User, Job, Location } = require("./mongodb")
var jwt = require("jsonwebtoken")
const jwksRsa = require("jwks-rsa")
const { GraphQLError } = require("graphql")
const { promisify } = require("util")

const privateProfileKey = process.env.PRIVATE_KEY
const publicProfileKey = process.env.PUBLIC_KEY

// const isAuthenticated = async (accessToken) => {
//     try {
//         if (!accessToken) return false
//         const { header: { kid } } = await jwt.decode(accessToken, { complete: true })
//         const client = jwksRsa({
//             cache: true,
//             rateLimit: true,
//             jwksRequestsPerMinute: 10,
//             jwksUri: `${process.env.AUTH0}/.well-known/jwks.json`
//         })
//         const getSigningKey = promisify(client.getSigningKey)
//         const { publicKey, rsaPublicKey } = await getSigningKey(kid)

//         const decoded = jwt.verify(accessToken, (publicKey || rsaPublicKey), {
//             audience: `${process.env.AUTH0}/api/v2/`,
//             issuer: `${process.env.AUTH0}/`,
//             algorithms: ['RS256']
//         })
//         return decoded
//     } catch (err) {
//         console.error("isAuthenticated catched error", err)
//         return false
//     }
// }

// isUser = async (sub, profileToken) => {
//     try {
//         const user = await jwt.verify(profileToken, publicProfileKey)
//         return (user && user.oAuth === sub) ? user : false
//     } catch (err) {
//         console.error("isUser catched error", err)
//         return false
//     }
// }

// isAdmin = user => user ? user.role === "admin" : false

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
        // const auth = await isAuthenticated(accessToken)
        // const user = await User.findOne({ oAuth: auth.sub }) ||
        //     new Error("Welcome. We do not know anything about you yet. Please add your profile information.")
        // return auth ? user : new Error("You are not authenticated")

        if (!idToken) {
          const e = new Error("Your login data is invalid!")
          e.name = "401, Unauthorized"
          return e
        }

        // console.log("resolver ctx user", user)
        // console.log("resolver ctx idToken", idToken)
        // console.log("resolver ctx profileToken", profileToken)
        const e = new Error("Please complete your profile first!")
        e.name = "404, User Not Found"
        return user || e
      } catch (err) {
        const e = new Error(err.message)
        e.name = "400, Bad Request"
        console.error("me resolver catched error", err)
        return e
      }
    }
    // async user(_, args, { accessToken, profileToken }) {
    //     try {
    //         const auth = await isAuthenticated(accessToken)
    //         if (!auth) return new Error("You are not authenticated")

    //         const userProfile = await isUser(auth.sub, profileToken)
    //         return (userProfile && isAdmin(userProfile))
    //             ? User.findOne(args)
    //             : new Error("You are not authorized to do this.")
    //     } catch (err) {
    //         console.error("user resolver catched error", err);
    //         return new Error(err.message)
    //     }
    // },
    // async allUsers(_, args, { accessToken, profileToken }) {
    //     try {
    //         const auth = await isAuthenticated(accessToken)
    //         if (!auth) return new Error("You are not authenticated")

    //         const userProfile = await isUser(auth.sub, profileToken)
    //         return (userProfile && isAdmin(userProfile))
    //             ? User.find()
    //             : new Error("You are not authorized to do this.")
    //     } catch (err) {
    //         console.error("allUsers resolver catched error", err)
    //         return new Error(err.message)
    //     }
    // },
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
    profileToken(user) {
      return jwt.sign(
        {
          id: user._id,
          oAuth: user.oAuth,
          role: user.role
        },
        privateProfileKey,
        {
          expiresIn: "6H",
          subject: user.oAuth,
          issuer: "JobCMSGraphql",
          algorithm: "RS256"
        }
      )
    },
    publicKey() {
      return publicProfileKey
    }
  },
  // User: {
  //     id(user) {
  //         return user._id
  //     }
  // },
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
    // async createUser(_, { input, location }, { accessToken, profileToken }) {
    //     try {
    //         const auth = await isAuthenticated(accessToken)
    //         if (!auth) return new Error("You are not authenticated")
    //         const userProfile = await isUser(auth.sub, profileToken)
    //         if (userProfile && isAdmin(userProfile)) {
    //             const user = new User({
    //                 _id: new mongoose.Types.ObjectId(),
    //                 ...input
    //             })
    //             const userLocation = await new Location({
    //                 category: "user",
    //                 user: user._id,
    //                 loc: location
    //             }).save()
    //             user.location = {
    //                 address: userLocation.loc.address,
    //                 data: userLocation._id
    //             }
    //             return await user.save()
    //         } else return new Error("You are not authorized to do this.")
    //     } catch (err) {
    //         console.error("createUser mutation catched error", err);
    //         return new Error(err.message)
    //     }
    // },
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
