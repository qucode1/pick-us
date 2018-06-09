import React, { Fragment, Component } from "react"
import { Mutation, withApollo } from "react-apollo"
import { Link, Redirect } from "react-router-dom"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Button from "material-ui/Button"
import TextField from "material-ui/TextField"

import Loading from "../loading/Loading"

const styles = theme => ({})

class UserFiles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userFiles: props.userFiles || []
    }
  }
  render() {
    return (
      <Fragment>
        <Typography variant="subheading">Dateien</Typography>
        {this.state.userFiles.map(id => (
          <Typography variant="body2" key={id}>
            {id}
          </Typography>
        ))}
        <Button color="primary">Hinzufügen</Button>
      </Fragment>
    )
  }
}

export default withStyles(styles)(UserFiles)
