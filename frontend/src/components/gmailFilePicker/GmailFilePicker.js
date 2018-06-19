import React, { Fragment } from "react"
import { Query } from "react-apollo"
import { Redirect } from "react-router-dom"

import { EMAILSWITHATTACHMENT } from "../../queries/email"
import { MyContext } from "../../utils/contextProvider"
import Loading from "../loading/Loading"

const GmailFilePicker = props => (
  <Query
    query={EMAILSWITHATTACHMENT}
    variables={{
      q: {
        email: props.email,
        hasAttachment: true
      }
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <Loading />
      if (error) {
        return (
          <Fragment>
            <MyContext.Consumer>
              {context => {
                return (
                  <Fragment>
                    {context.setError(error)}
                    <Redirect to="/error" />
                  </Fragment>
                )
              }}
            </MyContext.Consumer>
          </Fragment>
        )
      }
      if (data) {
        return (
          <Fragment>
            {data.emails.messages.length ? (
              data.emails.messages.map(({ decoded: message }) => (
                <div key={message.id}>
                  <h4>
                    {message.subject} {message.date}
                  </h4>
                </div>
              ))
            ) : (
              <h4>Keine Nachrichten mit Anhängen vorhanden.</h4>
            )}
          </Fragment>
        )
      }
    }}
  </Query>
)

export default GmailFilePicker
