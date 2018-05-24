import gql from "graphql-tag"

import {
  NameFragment,
  AuthFragment,
  FullProfileFragment
} from "../fragments/me"

export const ME = gql`
  query myProfile {
    me {
      id
      email
      ...NameFragment
      ...AuthFragment
    }
  }
  ${NameFragment}
  ${AuthFragment}
`
export const MYNAME = gql`
  query myName {
    me {
      id
      ...NameFragment
    }
  }
  ${NameFragment}
`
export const MYFULLPROFILE = gql`
  query myFullProfile {
    me {
      ...FullProfileFragment
    }
  }
  ${FullProfileFragment}
`
