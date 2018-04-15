const CustomError = require("./utils/customError")

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

let test = new CustomError(402, "Custom Error Message")
console.log(test)
