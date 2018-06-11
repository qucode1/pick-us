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

export const UserMessagesFragment = gql`
  fragment UserMessagesFragment on User {
    messages {
      id
      to
      from
      subject
      date
      message
    }
  }
`
export const FullUserProfileFragment = gql`
  fragment FullUserProfileFragment on User {
    id
    ...UserNameFragment
    ...UserAuthFragment
    ...UserMessagesFragment
    email
    files
  }
  ${UserNameFragment}
  ${UserAuthFragment}
  ${UserMessagesFragment}
`
