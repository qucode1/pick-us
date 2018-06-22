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

export const UserFilesFragment = gql`
  fragment UserFilesFragment on User {
    files {
      id
      driveId
      name
      webViewLink
      thumbnailLink
      createdAt
    }
  }
`
export const FullUserProfileFragment = gql`
  fragment FullUserProfileFragment on User {
    id
    ...UserNameFragment
    ...UserAuthFragment
    ...UserMessagesFragment
    ...UserFilesFragment
    email
  }
  ${UserNameFragment}
  ${UserAuthFragment}
  ${UserMessagesFragment}
  ${UserFilesFragment}
`
