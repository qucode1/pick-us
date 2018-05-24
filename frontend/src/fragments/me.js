import gql from "graphql-tag"

export const NameFragment = gql`
  fragment NameFragment on Me {
    firstName
    lastName
  }
`
export const AuthFragment = gql`
  fragment AuthFragment on Me {
    auth0
    role
  }
`
export const FullProfileFragment = gql`
  fragment FullProfileFragment on Me {
    id
    ...NameFragment
    ...AuthFragment
    email
    profileToken
  }
  ${NameFragment}
  ${AuthFragment}
`
