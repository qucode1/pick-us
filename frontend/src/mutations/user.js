import gql from "graphql-tag"

import { UserNameFragment } from "../fragments/user"

export const ADDUSER = gql`
  mutation addUser($input: UserInput!, $messages: [MessageInput]) {
    addUser(input: $input, messages: $messages) {
      id
      email
      ...UserNameFragment
    }
  }
  ${UserNameFragment}
`
