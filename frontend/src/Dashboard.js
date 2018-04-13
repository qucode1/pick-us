import React, { Fragment } from "react"
import { Query } from "react-apollo"
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
          console.error(error)
          return `${error.message}`
        }
        return (
          <Fragment>
            <h2>Dashboard Component</h2>
            <h3>{data.me.firstName}</h3>
            <h4>{data.me.email}</h4>
            <h4>{data.me.auth0}</h4>
          </Fragment>
        )
      }}
    </Query>
  )
}

export default Dashboard
