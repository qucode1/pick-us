import React, { Component } from "react"

import Dialog from "@material-ui/core/Dialog"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import { withStyles } from "@material-ui/core"

import LocalFilePicker from "../localFilePicker/LocalFilePicker"
import GmailFilePicker from "../gmailFilePicker/GmailFilePicker"

const styles = theme => ({
  tabs: {
    backgroundColor: theme.palette.primary.main,
    // borderRadius: theme.spacing.unit / 4,
    color: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[2]
  }
})

class AddFilesToProfile extends Component {
  state = {
    value: "gmail"
  }
  handleChange = (event, value) => {
    this.setState({ value })
  }
  handleClose = () => {
    this.props.onClose()
  }
  render() {
    const { value } = this.state
    const {
      classes,
      onClose,
      newFiles,
      newFileName,
      addNewFile,
      ...other
    } = this.props
    return this.props.open ? (
      <Dialog
        onClose={this.props.onClose}
        aria-labelledby="file-source-selection"
        {...other}
      >
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="secondary"
          // TabIndicatorProps={{ style: { backgroundColor: "lime" } }}
          fullWidth
          className={classes.tabs}
        >
          <Tab value="gmail" label="Gmail File Picker" />
          <Tab value="local" label="Local File Picker" />
        </Tabs>
        {value === "gmail" && (
          <GmailFilePicker
            email={this.props.email}
            newFileName={newFileName}
            addNewFile={addNewFile}
            onClose={onClose}
          />
        )}
        {value === "local" && (
          <LocalFilePicker
            email={this.props.email}
            newFileName={newFileName}
            addNewFile={addNewFile}
            onClose={onClose}
          />
        )}
      </Dialog>
    ) : null
  }
}

export default withStyles(styles)(AddFilesToProfile)
