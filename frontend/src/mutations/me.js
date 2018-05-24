import gql from "graphql-tag"

import { FullProfileFragment } from "../fragments/me"

export const UPDATEME = gql`
  mutation updateMe($input: UserInput!) {
    updateMe(input: $input) {
      ...FullProfileFragment
    }
  }
  ${FullProfileFragment}
`
