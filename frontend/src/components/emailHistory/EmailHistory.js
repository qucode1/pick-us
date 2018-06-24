import React, { Component } from "react"

import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import CardContent from "@material-ui/core/CardContent"

import Loading from "../loading/Loading"
import StyledCard from "../styledCard/StyledCard"

const styles = theme => ({
  emailHistoryMessage: {
    borderRadius: "2px",
    padding: theme.spacing.unit,
    margin: `${theme.spacing.unit}px 0`,
    borderBottom: "1px solid #6969691f"
    // "&:nth-of-type(odd)": {
    //   backgroundColor: "rgba(61, 110, 191, .05)"
    // }
  },
  sentMessage: {
    backgroundColor: "rgba(61, 110, 191, .05)"
  },
  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    margin: `${theme.spacing.unit}px 0`
  },
  messageInfo: {
    display: "flex",
    flexDirection: "column",
    width: "calc(100% / 3)",
    padding: `${theme.spacing.unit / 2}px`,
    alignItems: "flex-start",
    wordBreak: "break-word"
  },
  messageCategory: {
    fontWeight: "600"
  },
  actions: {
    display: "flex",
    justifyContent: "center"
  }
})

class EmailHistory extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  toggleMessage = id => {
    this.setState({
      [`message${id}`]: !this.state[`message${id}`]
    })
  }
  render() {
    const { messages, fetchingEmails, classes, email } = this.props
    return (
      <StyledCard>
        <CardContent style={{ position: "relative", minHeight: "50px" }}>
          <Typography variant="title">Emailverlauf</Typography>
          {messages &&
            messages.length > 0 &&
            messages.map(message => (
              <div
                key={message.id}
                className={`${classes.emailHistoryMessage}${
                  message.from.includes(email) ||
                  message.from.includes("via Info")
                    ? ""
                    : " " + classes.sentMessage
                }`}
              >
                <div className={classes.messageHeader}>
                  <div className={classes.messageInfo}>
                    <Typography
                      variant="subheading"
                      className={classes.messageCategory}
                    >
                      Von
                    </Typography>
                    <Typography variant="body1">{message.from}</Typography>
                  </div>
                  <div className={classes.messageInfo}>
                    <Typography
                      variant="subheading"
                      className={classes.messageCategory}
                    >
                      Betreff
                    </Typography>
                    <Typography variant="body1">{message.subject}</Typography>
                  </div>
                  <div className={classes.messageInfo}>
                    <Typography
                      variant="subheading"
                      className={classes.messageCategory}
                    >
                      Datum
                    </Typography>
                    <Typography variant="body1">{message.date}</Typography>
                  </div>
                </div>
                <div className={classes.content}>
                  <Typography
                    variant="subheading"
                    className={classes.messageCategory}
                  >
                    Nachricht
                  </Typography>
                  <Typography
                    variant="body1"
                    // dangerouslySetInnerHTML={{
                    //   __html:
                    //     message.message.length > 100 &&
                    //     !this.state[`message${message.id}`]
                    //       ? `${message.message.slice(0, 97)}...`
                    //       : message.message
                    // }}
                  >
                    {message.message.length > 200 &&
                    !this.state[`message${message.id}`]
                      ? `${message.message.slice(0, 197)}...`
                      : message.message}
                  </Typography>
                </div>
                <div className={classes.actions}>
                  {message.message.length > 200 && (
                    <Button
                      color="primary"
                      onClick={() => this.toggleMessage(message.id)}
                    >
                      {this.state[`message${message.id}`] ? "Weniger" : "Mehr"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          {fetchingEmails && <Loading />}
        </CardContent>
      </StyledCard>
    )
  }
}

export default withStyles(styles)(EmailHistory)
