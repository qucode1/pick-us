import gql from "graphql-tag"

export const UserNameFragment = gql`
  fragment UserNameFragment on User {
    firstName
    lastName
  }
`
export const UserAuthFragment = gql`
  fragment UserAuthFragment on User {
    auth0
    role
  }
`
export const FullUserProfileFragment = gql`
  fragment FullUserProfileFragment on User {
    id
    ...UserNameFragment
    ...UserAuthFragment
    email
  }
  ${UserNameFragment}
  ${UserAuthFragment}
`
