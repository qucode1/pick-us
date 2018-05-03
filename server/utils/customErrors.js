const { createError } = require("apollo-errors")

exports.NoUserDataError = createError("No User Data", {
  message:
    "We do not know anything about you yet. Please add some information to your profile.",
  data: {
    code: 404,
    info: "No user data in resolver context"
  }
})

exports.AuthenticationError = createError("Not Logged In", {
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

exports.DuplicateUserError = createError("Duplicate Email", {
  message:
    "We found another user with your email." +
    "This should only happen if you applied manually before and we " +
    "added your profile to our database. Please confirm the phone number " +
    "you applied with, to receive a verification email. If you have" +
    "have never applied before, contact us",
  data: {
    code: 409
  }
})

exports.CustomError = createError("Custom Error", {
  message: "Custom Error"
})
