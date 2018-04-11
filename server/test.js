const obj = {
    accessToken: "aToken",
    user: "me"
}
const foo = async ({ accessToken, profileToken, user }) => {
    try {
        const result = {}
        accessToken && (result.accessToken = accessToken)
        profileToken && (result.profileToken = profileToken)
        user && (result.user = user)
        return result
    } catch (err) {
        console.error(err);
    }
}
console.log(foo(obj))