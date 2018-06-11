import React, { Fragment } from "react"
import { Redirect, withRouter } from "react-router-dom"
import { Mutation } from "react-apollo"

import { MyContext } from "../../utils/contextProvider"

import ProfileQueryWrapper from "../profileQueryWrapper/ProfileQueryWrapper"

const ProfileMutationWrapper = props => (
  <Mutation mutation={props.mutation}>
    {(update, { loading, error, data }) => {
      if (loading) return <h3>Loading...</h3>
      else if (error) {
        return (
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
        )
      } else return <ProfileQueryWrapper {...props} update={update} />
    }}
  </Mutation>
)

export default withRouter(ProfileMutationWrapper)
