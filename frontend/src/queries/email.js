import gql from "graphql-tag"

export const EMAILHISTORY = gql`
  query emailHistory($q: GmailQueryInput) {
    emails(q: $q) {
      messages {
        decoded {
          id
          to
          from
          date
          subject
          message
        }
      }
    }
  }
`
