import React, { Fragment } from "react"
import { Redirect } from "react-router-dom"
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag"

import { MyContext } from "../../utils/contextProvider"

import Profile from "../profile/Profile"

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
const UPDATE_ME = gql`
  mutation updateMe($input: UserInput!) {
    updateMe(input: $input) {
      id
      firstName
      lastName
      email
      role
      auth0
      profileToken
    }
  }
`

const ProfileQueryWrapper = props => (
  <Query query={ME}>
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
      if (!localStorage.getItem("profileToken")) {
        localStorage.setItem("profileToken", data.me.profileToken)
      }
      return <Profile {...props} {...data.me} />
    }}
  </Query>
)

const ProfileMutationWrapper = props => (
  <Mutation
    mutation={UPDATE_ME}
    // update={(cache, { data: { updateMe } }) => {
    //   const { me } = cache.readQuery({ query: ME })
    //   console.dir({ ...me, ...updateMe })
    //   cache.writeQuery({
    //     query: ME,
    //     data: {
    //       me: {
    //         ...me,
    //         firstName: updateMe.firstName,
    //         lastName: updateMe.lastName,
    //         email: updateMe.email,
    //         __typename: updateMe.__typename
    //       }
    //     }
    //   })
    // }}
  >
    {(updateMe, { loading, error, data }) => {
      if (loading) return <h3>Loading...</h3>
      else if (error)
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
      else if (data) {
        localStorage.setItem("profileToken", data.updateMe.profileToken)
        return <ProfileQueryWrapper {...props} updateMe={updateMe} />
      } else return <ProfileQueryWrapper {...props} updateMe={updateMe} />
    }}
  </Mutation>
)

export default ProfileMutationWrapper
