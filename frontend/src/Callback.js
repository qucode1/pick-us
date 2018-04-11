// comes back with accessToken
// callback runs Me query, which verifies the accessToken and searches the db for a user with accessToken.sub, then returns a profileToken if one exists
// redirect to user dashboard OR profile page if user does not exist to create a user profile
import React, { Fragment } from "react"
import { Link } from "react-router-dom"
const Callback = () => (
    <Fragment>
        <h3>Callback Component</h3>
        <Link to="/">Home</Link>
    </Fragment>
)

export default Callback