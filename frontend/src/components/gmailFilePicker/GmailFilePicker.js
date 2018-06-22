import React, { Fragment, Component } from "react"
import { Query } from "react-apollo"
import { Redirect } from "react-router-dom"

import { EMAILSWITHATTACHMENT } from "../../queries/email"
import { MyContext } from "../../utils/contextProvider"
import Loading from "../loading/Loading"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { withStyles } from "@material-ui/core"

const styles = theme => ({
  root: {
    margin: `${theme.spacing.unit / 2}px`
  },
  message: {
    margin: `${theme.spacing.unit}px`,
    padding: `${theme.spacing.unit / 2}px`,
    borderBottom: "1px solid #6969691f"
  },
  attachmentButton: {
    textTransform: "none"
  }
})

class GmailFilePicker extends Component {
  render() {
    return (
      <Query
        query={EMAILSWITHATTACHMENT}
        variables={{
          q: {
            email: this.props.email,
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
            const { addNewFile, onClose, classes } = this.props
            return (
              <div className={classes.root}>
                {data.emails.messages.length ? (
                  data.emails.messages.map(({ decoded: message }) => (
                    <div key={message.id} className={classes.message}>
                      <Typography variant="title">{message.subject}</Typography>
                      <Typography variant="subheading">
                        {message.date}
                      </Typography>
                      {message.attachments.map(attachment => (
                        <Button
                          key={attachment.attachmentId}
                          color="secondary"
                          classes={{ label: classes.attachmentButton }}
                          onClick={() => {
                            const fileExtension = attachment.fileName.split(
                              "."
                            )[1]
                            addNewFile({
                              name:
                                this.props.newFileName + `.${fileExtension}`,
                              userId: this.props.userId,
                              attachmentId: attachment.attachmentId,
                              messageId: message.id,
                              mimeType: attachment.mimeType
                            })
                            onClose()
                          }}
                        >
                          {attachment.fileName}
                        </Button>
                      ))}
                    </div>
                  ))
                ) : (
                  <h4>Keine Nachrichten mit Anhängen vorhanden.</h4>
                )}
              </div>
            )
          }
        }}
      </Query>
    )
  }
}

export default withStyles(styles)(GmailFilePicker)
