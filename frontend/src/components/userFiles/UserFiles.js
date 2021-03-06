import React, { Component } from "react"

import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"

import AddFilesToProfile from "../addFilesToProfile/AddFilesToProfile"

const fileCategories = [
  "Lebenslauf",
  "Führungszeugnis",
  "Waffensachkunde",
  "Sachkundeprüfung",
  "VGS",
  "AVV"
]

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column"
  },
  formControl: {
    margin: theme.spacing.unit * 3,
    minWidth: 120
  },
  input: {
    margin: theme.spacing.unit
  },
  addFileButtonLabel: {
    textTransform: "capitalize"
  },
  newFileSelection: {
    minWidth: "100px"
  },
  files: {
    display: "flex",
    justifyItems: "center",
    alignItems: "flex-start",
    flexDirection: "column"
  },
  newFile: {
    color: "limegreen",
    "&:disabled": {
      color: "limegreen"
    }
  }
})

class UserFiles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addingFiles: false,
      newFileType: "Lebenslauf",
      newFileName: "",
      savedFiles: props.savedFiles || []
    }
  }
  handleClickOpenFilePicker = () => {
    this.setState({ addingFiles: true })
  }
  handleNewFileChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  handleFilePickerClose = () => {
    this.setState({ addingFiles: false })
  }
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <FormControl margin="normal">
          <Typography variant="title">Dateien</Typography>
          <Select
            value={this.state.newFileType}
            onChange={this.handleNewFileChange}
            margin="dense"
            className={`${classes.newFileSelection} ${classes.input}`}
            inputProps={{
              name: "newFileType",
              id: "newFileType"
            }}
          >
            {fileCategories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
            <MenuItem value={0}>Andere</MenuItem>
          </Select>
          {!this.state.newFileType && (
            <TextField
              id="newFileName"
              name="newFileName"
              label="Dateiname"
              margin="dense"
              value={this.state.newFileName}
              onChange={this.handleNewFileChange}
              className={classes.input}
              autoFocus
            />
          )}
          <Button
            color="secondary"
            onClick={this.handleClickOpenFilePicker}
            classes={{
              textSecondary: classes.addFileButton,
              label: classes.addFileButtonLabel
            }}
            disabled={!this.props.email}
          >
            Datei Auswählen
          </Button>
        </FormControl>
        <div className={classes.files}>
          {this.props.newFiles.map(file => (
            <Button
              className={classes.newFile}
              key={file.attachmentId}
              disabled
            >
              {file.name}
            </Button>
          ))}
          {this.props.newLocalFiles.map((file, newLocalFileIndex) => (
            <Button
              className={classes.newFile}
              key={`newLocalFile-${newLocalFileIndex}`}
              disabled
            >
              {file.name}
            </Button>
          ))}
          {this.state.savedFiles.map(file => (
            <Button
              key={file.id}
              href={file.webViewLink}
              target="_blank"
              rel="noopener"
            >
              {file.name}
            </Button>
          ))}
        </div>
        <AddFilesToProfile
          open={this.state.addingFiles}
          onClose={this.handleFilePickerClose}
          email={this.props.email}
          newFiles={this.props.newFiles}
          addNewFile={this.props.addNewFile}
          newFileName={this.state.newFileType || this.state.newFileName}
        />
      </div>
    )
  }
}

export default withStyles(styles)(UserFiles)
