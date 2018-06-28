import React, { Component, Fragment } from "react"
import Dropzone from "react-dropzone"

import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2
  },
  dropzone: {
    width: `calc(100% - ${theme.spacing.unit * 4}px)`,
    height: "50%",
    minHeight: "200px",
    padding: theme.spacing.unit * 2,
    backgroundColor: "rgba(0, 0, 0, 0.06)"
  }
})

class UserFileDropzone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      accepted: [],
      rejected: []
    }
  }
  render() {
    return (
      <div className={this.props.classes.root}>
        <Dropzone
          accept="application/msword, application/pdf, image/jpeg, image/png, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onDrop={(accepted, rejected) => {
            this.setState({ accepted, rejected })
          }}
          className={this.props.classes.dropzone}
        >
          <p>Hier klicken oder Datei ablegen.</p>
          <p>Akzeptierte Formate: word, pdf, jpeg, png</p>
        </Dropzone>
        <ul>
          <p>Akzeptiert:</p>
          {console.log(this.state.accepted[0])}
          {this.state.accepted.map(file => (
            <li key={file.name}>
              {file.name} - {file.size}
            </li>
          ))}
        </ul>
        <ul>
          <p>Unzulässig:</p>
          {this.state.rejected.map(file => (
            <li key={file.name}>
              {file.name} - {file.size}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default withStyles(styles)(UserFileDropzone)
