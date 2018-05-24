import gql from "graphql-tag"

import { NameFragment } from "../fragments/user"

export const ADDUSER = gql`
  mutation addUser($input: UserInput!) {
    addUser(input: $input) {
      id
      email
      ...NameFragment
    }
  }
  ${NameFragment}
`
