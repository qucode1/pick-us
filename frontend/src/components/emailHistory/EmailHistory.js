import React, { Component } from "react"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Button from "material-ui/Button"
import Card, { CardContent } from "material-ui/Card"

import Loading from "../loading/Loading"

const styles = theme => ({
  card: {
    // position: "relative",
    margin: `${theme.spacing.unit * 2}px auto`,
    width: "75%",
    maxWidth: "800px",
    [theme.breakpoints.down("md")]: {
      width: "95%"
    }
  },
  emailHistoryMessage: {
    borderRadius: "2px",
    padding: theme.spacing.unit,
    "&:nth-of-type(odd)": {
      backgroundColor: "rgba(61, 110, 191, .05)"
    }
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
    const { messages, fetchingEmails, classes } = this.props
    return (
      <Card className={classes.card}>
        <CardContent style={{ position: "relative", minHeight: "50px" }}>
          <Typography variant="title">Emailverlauf</Typography>
          {messages &&
            messages.length > 0 &&
            messages.map(message => (
              <div
                key={message.decoded.id}
                className={classes.emailHistoryMessage}
              >
                <div className={classes.messageHeader}>
                  <div className={classes.messageInfo}>
                    <Typography
                      variant="caption"
                      className={classes.messageCategory}
                    >
                      Von
                    </Typography>
                    <Typography variant="caption">
                      {message.decoded.from}
                    </Typography>
                  </div>
                  <div className={classes.messageInfo}>
                    <Typography
                      variant="caption"
                      className={classes.messageCategory}
                    >
                      Betreff
                    </Typography>
                    <Typography variant="caption">
                      {message.decoded.subject}
                    </Typography>
                  </div>
                  <div className={classes.messageInfo}>
                    <Typography
                      variant="caption"
                      className={classes.messageCategory}
                    >
                      Datum
                    </Typography>
                    <Typography variant="caption">
                      {message.decoded.date}
                    </Typography>
                  </div>
                </div>
                <div className={classes.content}>
                  <Typography
                    variant="caption"
                    className={classes.messageCategory}
                  >
                    Nachricht
                  </Typography>
                  <Typography
                    variant="caption"
                    // dangerouslySetInnerHTML={{
                    //   __html:
                    //     message.decoded.message.length > 100 &&
                    //     !this.state[`message${message.decoded.id}`]
                    //       ? `${message.decoded.message.slice(0, 97)}...`
                    //       : message.decoded.message
                    // }}
                  >
                    {message.decoded.message.length > 200 &&
                    !this.state[`message${message.decoded.id}`]
                      ? `${message.decoded.message.slice(0, 197)}...`
                      : message.decoded.message}
                  </Typography>
                </div>
                <div className={classes.actions}>
                  {message.decoded.message.length > 200 && (
                    <Button
                      color="primary"
                      onClick={() => this.toggleMessage(message.decoded.id)}
                    >
                      {this.state[`message${message.decoded.id}`]
                        ? "Weniger"
                        : "Mehr"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          {fetchingEmails && <Loading />}
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(EmailHistory)
