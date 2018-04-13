// comes back with accessToken
// callback runs Me query, which verifies the accessToken and searches the db for a user with accessToken.sub, then returns a profileToken if one exists
// redirect to user dashboard OR profile page if user does not exist to create a user profile
import React, { Fragment } from "react"
import { Query } from "react-apollo"
import { Redirect } from "react-router-dom"
import gql from "graphql-tag"

import { ErrorContext } from "./utils/contextProvider"

const ME = gql`
  {
    me {
      firstName
      email
      auth0
    }
  }
`

const Dashboard = () => {
  return (
    <Query query={ME}>
      {({ loading, error, data }) => {
        if (loading) return "Loading..."
        if (error) {
          <Fragment>
            <ErrorContext.Consumer>
              {({ setError }) => error}
            </ErrorContext.Consumer>
            <Redirect to="/error" />
          </Fragment>
        }
        return <Redirect to="/" />
      }}
    </Query>
  )
}

export default Dashboard
