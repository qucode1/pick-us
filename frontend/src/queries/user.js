import gql from "graphql-tag"

import {
  UserNameFragment,
  UserAuthFragment,
  UserMessagesFragment,
  UserFilesFragment,
  FullUserProfileFragment
} from "../fragments/user"

export const USER = gql`
  query userProfile(
    $id: String
    $firstName: String
    $lastName: String
    $email: String
  ) {
    user(id: $id, firstName: $firstName, lastName: $lastName, email: $email) {
      id
      email
      ...UserNameFragment
      ...UserAuthFragment
      ...UserMessagesFragment
      ...UserFilesFragment
    }
  }
  ${UserNameFragment}
  ${UserAuthFragment}
  ${UserMessagesFragment}
  ${UserFilesFragment}
`

export const USERNAME = gql`
  query userName {
    user {
      id
      ...UserNameFragment
    }
  }
  ${UserNameFragment}
`

export const USERFULLPROFILE = gql`
  query userFullProfile {
    user {
      ...FullUserProfileFragment
    }
  }
  ${FullUserProfileFragment}
`

export const ALLUSERS = gql`
  query allUsers($limit: Int, $skip: Int) {
    allUsers(limit: $limit, skip: $skip) {
      id
      firstName
      lastName
      email
      role
    }
  }
`
