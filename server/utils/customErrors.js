const { createError } = require("apollo-errors")

exports.NoUserDataError = createError("No User Data", {
  message:
    "We do not know anything about you yet. Please add some information to your profile.",
  data: {
    code: 404,
    info: "No user data in resolver context"
  }
})

exports.AuthenticationError = createError("Not Logged in", {
  message: "You need to be logged to access this. Please log in first",
  data: {
    code: 401
  }
})

exports.AuthorizationError = createError("Not Authorized", {
  message: "You are not authorized to access this!",
  data: {
    code: 403
  }
})

exports.CustomError = createError("Custom Error", {
  message: "Custom Error"
})
