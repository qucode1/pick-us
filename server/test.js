const { Base64 } = require("js-base64")

const func = async () => {
  try {
    const email = {
      from: "info@qucode.eu",
      to: "quinius_789@yahoo.de",
      subject: "testing gmail api",
      message: "Hi. This is a test message from the node server."
    }
    const emailString = `From: qucode info <${email.from}>
            To: Yannick <${email.to}>
            Subject: ${email.subject}
            
            ${email.message}`

    return Base64.encodeURI(emailString)
  } catch (err) {
    throw err
  }
}

func()
  .then(res => console.log(res))
  .catch(err => console.error(err))

// const CustomError = require("./utils/customError")

// const obj = {
//     accessToken: "aToken",
//     user: "me"
// }
// const foo = async ({ accessToken, profileToken, user }) => {
//     try {
//         const result = {}
//         accessToken && (result.accessToken = accessToken)
//         profileToken && (result.profileToken = profileToken)
//         user && (result.user = user)
//         return result
//     } catch (err) {
//         console.error(err);
//     }
// }
// console.log(foo(obj))

// class CustomError extends Error {
//   constructor(code, message) {
//     super(message)
//     this.code = code
//   }
// }

// let test = new CustomError(402, "Custom Error Message")
// console.log(test)
