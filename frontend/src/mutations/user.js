import gql from "graphql-tag"

import { UserNameFragment, UserMessagesFragment } from "../fragments/user"

export const ADDUSER = gql`
  mutation addUser($input: UserInput!, $messages: [MessageInput]) {
    addUser(input: $input, messages: $messages) {
      id
      email
      ...UserNameFragment
      ...UserMessagesFragment
    }
  }
  ${UserNameFragment}
  ${UserMessagesFragment}
`

export const UPDATEUSER = gql`
  mutation updateUser(
    $id: String!
    $input: UserInput!
    $messages: [MessageInput]
  ) {
    updateUser(id: $id, input: $input, messages: $messages) {
      id
      email
      ...UserNameFragment
      ...UserMessagesFragment
    }
  }
  ${UserNameFragment}
  ${UserMessagesFragment}
`
