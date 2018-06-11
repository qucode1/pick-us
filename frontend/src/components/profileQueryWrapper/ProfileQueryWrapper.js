import React, { Fragment } from "react"
import { Redirect } from "react-router-dom"
import { Query } from "react-apollo"

import { MyContext } from "../../utils/contextProvider"

import Profile from "../profile/Profile"

import EmailHistory from "../emailHistory/EmailHistory"

const ProfileQueryWrapper = props => (
  <Query query={props.query} variables={props.queryVariables}>
    {({ loading, error, data }) => {
      if (loading) return "Loading..."
      if (error) {
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
      }
      return (
        <Fragment>
          <Profile {...props} {...data.user} {...data.me} />
          {props.mutationTarget === "user" && (
            <EmailHistory
              messages={data.user ? data.user.messages : []}
              fetchingEmails={loading}
            />
          )}
        </Fragment>
      )
    }}
  </Query>
)

export default ProfileQueryWrapper
