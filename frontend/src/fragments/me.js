import gql from "graphql-tag"

export const MyNameFragment = gql`
  fragment MyNameFragment on Me {
    firstName
    lastName
  }
`
export const MyAuthFragment = gql`
  fragment MyAuthFragment on Me {
    auth0
    role
  }
`
export const FullProfileFragment = gql`
  fragment FullProfileFragment on Me {
    id
    ...MyNameFragment
    ...MyAuthFragment
    email
    profileToken
  }
  ${MyNameFragment}
  ${MyAuthFragment}
`
