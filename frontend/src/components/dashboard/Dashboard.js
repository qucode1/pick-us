import React, { Fragment } from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Link, Redirect } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

const ME = gql`
  {
    me {
      id
      firstName
      lastName
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
        else if (error) {
          return (
            <Fragment>
              <MyContext.Consumer>
                {context => {
                  return (
                    <Fragment>
                      {context.setError(error)}
                      <Redirect to="/error" />
                    </Fragment>
                  )
                }}
              </MyContext.Consumer>
            </Fragment>
          )
        } else {
          let response
          // localStorage.setItem("profileToken", data.me.profileToken)
          if (data.me.role === "tempUser" || data.me.role === "newUser") {
            response = <Redirect to="/profile" />
          } else
            response = (
              <Fragment>
                <h2>Dashboard Component</h2>
                <h4>
                  {data.me.firstName} {data.me.lastName}
                </h4>
                <h4>{data.me.email}</h4>
                <h4>{data.me.role}</h4>
                <h4>{data.me.auth0}</h4>
                <Link to="/profile">Profile</Link>
              </Fragment>
            )
          return response
        }
      }}
    </Query>
  )
}

export default Dashboard
