import gql from "graphql-tag"

import { UserNameFragment } from "../fragments/user"

export const ADDUSER = gql`
  mutation addUser($input: UserInput!) {
    addUser(input: $input) {
      id
      email
      ...UserNameFragment
    }
  }
  ${UserNameFragment}
`
