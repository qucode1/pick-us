const { promisify } = require("util")
const jwt = require("jsonwebtoken")
const jwksRsa = require("jwks-rsa")
const mongoose = require("mongoose")
const { User } = require("../data/mongodb")

const privateUserKey = process.env.PRIVATEUSERKEY

exports.verifyIdToken = async token => {
  try {
    // console.log("verifyIdToken token", token)
    const {
      header: { kid }
    } = await jwt.decode(token, { complete: true })
    // console.log("verifyIdToken kid", kid)
    const client = jwksRsa({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 6,
      jwksUri: `${process.env.AUTH0}/.well-known/jwks.json`
    })
    // console.log("verifyIdToken client", client)
    const getSigningKey = promisify(client.getSigningKey)
    const signingKey = await getSigningKey(kid)
    // console.log("verifyIdToken signingKey", signingKey)
    const { publicKey, rsaPublicKey } = signingKey
    const decoded = await jwt.verify(token, publicKey || rsaPublicKey, {
      issuer: `${process.env.AUTH0}/`,
      algorithms: ["RS256"]
    })
    // console.log("verified idToken", decoded)
    return decoded
  } catch (err) {
    console.error("verifyIdToken", err)
    return err
  }
}

exports.findUserByAuthSub = async sub => {
  try {
    // console.log("findUserByAuthSub start")
    const user = await User.findOne({ auth0: sub }).lean()
    // console.log("findUserByAuthSub findOne", user)
    return user
  } catch (err) {
    console.error("findUserByAuthSub", err)
    return err
  }
}

exports.createProfileToken = async (userData, auth0Payload) => {
  try {
    const token = await jwt.sign(userData, privateUserKey, {
      expiresIn: auth0Payload.exp,
      subject: userData.auth0,
      issuer: `${process.env.ISSUER}`,
      algorithm: "RS256"
    })
    // console.log("created ProfileToken", token)
    return token
  } catch (err) {
    console.error("createProfileToken", err)
    return err
  }
}
