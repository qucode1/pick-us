import gql from "graphql-tag"

export const NameFragment = gql`
  fragment NameFragment on User {
    firstName
    lastName
  }
`
export const AuthFragment = gql`
  fragment AuthFragment on User {
    auth0
    role
  }
`
export const FullUserProfileFragment = gql`
  fragment FullUserProfileFragment on User {
    id
    ...NameFragment
    ...AuthFragment
    email
  }
  ${NameFragment}
  ${AuthFragment}
`
