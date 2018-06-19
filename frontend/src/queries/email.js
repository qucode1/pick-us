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

export const EMAILSWITHATTACHMENT = gql`
  query emailsWithAttachment($q: GmailQueryInput) {
    emails(q: $q) {
      messages {
        decoded {
          id
          date
          subject
          attachments {
            fileName
            mimeType
            attachmentId
          }
        }
      }
    }
  }
`
