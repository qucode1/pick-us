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
    $localFiles: [LocalFileInput!]
  ) {
    addUser(
      input: $input
      messages: $messages
      files: $files
      localFiles: $localFiles
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

export const UPDATEUSER = gql`
  mutation updateUser(
    $id: String!
    $input: UserInput!
    $messages: [MessageInput]
    $newFiles: [FileInput]
    $newLocalFiles: [LocalFileInput!]
    $savedFiles: [SavedFileInput]
  ) {
    updateUser(
      id: $id
      input: $input
      messages: $messages
      savedFiles: $savedFiles
      newLocalFiles: $newLocalFiles
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
