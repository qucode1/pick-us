import gql from "graphql-tag"

import {
  MyNameFragment,
  MyAuthFragment,
  FullProfileFragment
} from "../fragments/me"

export const ME = gql`
  query myProfile {
    me {
      id
      email
      ...MyNameFragment
      ...MyAuthFragment
    }
  }
  ${MyNameFragment}
  ${MyAuthFragment}
`
export const MYNAME = gql`
  query myName {
    me {
      id
      ...MyNameFragment
    }
  }
  ${MyNameFragment}
`
export const MYFULLPROFILE = gql`
  query myFullProfile {
    me {
      ...FullProfileFragment
    }
  }
  ${FullProfileFragment}
`
