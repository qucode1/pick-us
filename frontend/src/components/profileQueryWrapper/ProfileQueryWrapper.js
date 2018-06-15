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
      if (data && data.me && !localStorage.getItem("profileToken")) {
        localStorage.setItem("profileToken", data.me.profileToken)
      }
      const messages =
        props.updatedMessages.length > 0
          ? props.updatedMessages
          : data.user ? data.user.messages : []
      return (
        <Fragment>
          <Profile {...props} {...data.user} {...data.me} messages={messages} />
          {props.mutationTarget === "user" && (
            <EmailHistory messages={messages} fetchingEmails={loading} />
          )}
        </Fragment>
      )
    }}
  </Query>
)

export default ProfileQueryWrapper
