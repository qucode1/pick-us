import { Auth0Lock } from "auth0-lock"

const lock = new Auth0Lock(
    'xHSXxVVTnPIygLxUsl678b5K37xgkS0p',
    'pick-us.eu.auth0.com',
    {
        language: 'de',
        // redirect: true,
        // redirectUrl: 'http://localhost:3000',
        allowSignUp: false,
        autofocus: true,
        autocomplete: true,
        autoclose: true,
        rememberLastLogin: true,
        allowedConnections: ['Username-Password-Authentication'],
        theme: {
            logo: 'https://image.ibb.co/iMwVKx/icon_152x152.png',
            primaryColor: 'rgb(46, 112, 185)'
        },
        auth: {
            redirect: false,
            responseType: 'token id_token',
            sso: true,
        }
    }
)

lock.on("authenticated", authResult => {
    // console.log(authResult);
    lock.getUserInfo(authResult.accessToken, (err, profile) => {
        if (err) console.error(err);
        console.log(profile);
        localStorage.setItem('idToken', authResult.idToken)
        localStorage.setItem('accessToken', authResult.accessToken)
    })
})

lock.on("authorization_error", err => {
    const search = "com.auth0.auth."
    const matches = Object.keys(localStorage)
        .filter(key => key.startsWith(search))
        .forEach(match => localStorage.removeItem(match))
})

export const loginUser = (lock) => {
    lock.show()
}
export const logoutUser = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("idToken")
}

export default lock