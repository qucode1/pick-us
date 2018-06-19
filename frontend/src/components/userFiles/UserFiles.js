import React, { Fragment, Component } from "react"
import { Mutation, withApollo } from "react-apollo"
import { Link, Redirect } from "react-router-dom"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Button from "@material-ui/core/Button"
import TextField from "material-ui/TextField"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"

import Loading from "../loading/Loading"
import AddFilesToProfile from "../addFilesToProfile/AddFilesToProfile"

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
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
    alignItems: "center"
  }
})

class UserFiles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addingFiles: false,
      newFileType: 10,
      userFiles: props.userFiles || []
    }
  }
  handleClickOpenFilePicker = () => {
    this.setState({ addingFiles: true })
  }
  handleNewFileSelection = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  handleNewFileName = e => {
    this.setState({ [e.target.id]: e.target.value })
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
            onChange={this.handleNewFileSelection}
            margin="dense"
            className={`${classes.newFileSelection} ${classes.input}`}
            inputProps={{
              name: "newFileType",
              id: "newFileType"
            }}
          >
            <MenuItem value={10}>Lebenslauf</MenuItem>
            <MenuItem value={20}>Zeugnisse</MenuItem>
            <MenuItem value={30}>Andere</MenuItem>
          </Select>
          {this.state.newFileType === 30 && (
            <TextField
              id="newFileName"
              name="newFileName"
              label="Dateiname"
              margin="dense"
              onChange={this.handleNewFileSelection}
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
        {this.state.userFiles.map(id => (
          <Typography variant="body2" key={id}>
            {id}
          </Typography>
        ))}
        <AddFilesToProfile
          open={this.state.addingFiles}
          onClose={this.handleFilePickerClose}
          email={this.props.email}
        />
      </div>
    )
  }
}

export default withStyles(styles)(UserFiles)
