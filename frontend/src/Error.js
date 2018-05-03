import React, { Fragment } from "react"
import { Link, Redirect } from "react-router-dom"

import { MyContext } from "./utils/contextProvider"

const ErrorComponent = () => (
  <Fragment>
    <MyContext.Consumer>
      {({ state: { error } }) => {
        if (error && error.graphQLErrors && error.graphQLErrors.length > 0) {
          return handleFirstError(error.graphQLErrors[0])
        } else if (error) return <p>{error.message}</p>
        return <p>Sorry, something went wrong :(</p>
      }}
    </MyContext.Consumer>
    <Link to="/">Home</Link>
    <Link to="/profile">Profile</Link>
  </Fragment>
)

export default ErrorComponent

const handleFirstError = err => {
  switch (err.name) {
    case "No User Data":
    case "Duplicate Email":
      return <Redirect push to="/profile" />
    case "Not Logged In":
      return <Redirect push to="/" />
    case "Not Authorized":
    case "Custom Error":
    default:
      return (
        <Fragment>
          <p>default</p>
          <h4>{err.name}</h4>
          <p>{err.message}</p>
        </Fragment>
      )
  }
}
