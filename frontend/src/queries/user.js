import gql from "graphql-tag"

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
