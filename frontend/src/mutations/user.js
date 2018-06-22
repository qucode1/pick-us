import gql from "graphql-tag"

import {
  UserNameFragment,
  UserMessagesFragment,
  UserFilesFragment
} from "../fragments/user"

export const ADDUSER = gql`
  mutation addUser(
    $input: UserInput!
    $messages: [MessageInput]
    $files: [FileInput]
  ) {
    addUser(input: $input, messages: $messages, files: $files) {
      id
      email
      ...UserNameFragment
      ...UserMessagesFragment
      ...UserFilesFragment
    }
  }
  ${UserNameFragment}
  ${UserMessagesFragment}
  ${UserFilesFragment}
`

export const UPDATEUSER = gql`
  mutation updateUser(
    $id: String!
    $input: UserInput!
    $messages: [MessageInput]
    $newFiles: [FileInput]
    $savedFiles: [SavedFileInput]
  ) {
    updateUser(
      id: $id
      input: $input
      messages: $messages
      savedFiles: $savedFiles
      newFiles: $newFiles
    ) {
      id
      email
      ...UserNameFragment
      ...UserMessagesFragment
      ...UserFilesFragment
    }
  }
  ${UserNameFragment}
  ${UserMessagesFragment}
  ${UserFilesFragment}
`
