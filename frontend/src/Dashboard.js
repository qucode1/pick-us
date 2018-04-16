import React, { Fragment } from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"

const ME = gql`
  {
    me {
      profileToken
      email
      auth0
      role
    }
  }
`

const Dashboard = () => {
  return (
    <Query query={ME}>
      {({ loading, error, data }) => {
        if (loading) return "Loading..."
        if (error) {
          return (
            <Fragment>
              {error.graphQLErrors.map(error => (
                <Fragment key={error.time_thrown}>
                  <h3>
                    {error.data.code}: {error.name}
                  </h3>
                  <h4>{error.message}</h4>
                  {error.data.code === 404 && (
                    <Link to="/profile">Edit Profile</Link>
                  )}
                </Fragment>
              ))}
            </Fragment>
          )
        }
        localStorage.setItem("profileToken", data.me.profileToken)
        return (
          <Fragment>
            <h2>Dashboard Component</h2>
            <h4>{data.me.email}</h4>
            <h4>{data.me.auth0}</h4>
          </Fragment>
        )
      }}
    </Query>
  )
}

export default Dashboard
