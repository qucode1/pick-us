import React, { Fragment } from "react"
import { Link } from "react-router-dom"

import { MyContext } from "./utils/contextProvider"

const ErrorComponent = ({ err }) => (
  <Fragment>
    <MyContext.Consumer>
      {({ state: { error } }) => {
        if (error) return <p>{error.message}</p>
        if (error && error.graphQLErrors) {
          return (
            <Fragment>
              <h4>{error.graphQLErrors[0].name}</h4>
              <p>{error.graphQLErrors[0].message}</p>
            </Fragment>
          )
        }
        return <p>Sorry, something went wrong :(</p>
      }}
    </MyContext.Consumer>
    <Link to="/">Home</Link>
    <Link to="/profile">Profile</Link>
  </Fragment>
)

export default ErrorComponent
