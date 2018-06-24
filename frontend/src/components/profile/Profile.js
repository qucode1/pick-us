import React, { Fragment, Component } from "react"
import { Link } from "react-router-dom"

import { withStyles } from "@material-ui/core/styles"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"

import UserFiles from "../userFiles/UserFiles"

import StyledCard from "../styledCard/StyledCard"

const styles = theme => ({
  heading: {
    textAlign: "center",
    margin: theme.spacing.unit * 2
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "200px",
    [theme.breakpoints.down("xs")]: {
      width: "95%"
    }
  }
})

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: this.props.firstName || "",
      lastName: this.props.lastName || "",
      email: this.props.email || "",
      messages: this.props.messages || [],
      savedFiles: this.props.files || [],
      newFiles: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.updateProfile = this.updateProfile.bind(this)
  }
  componentDidMount() {
    if (this.props.mutationTarget === "user") {
      this.props.getNewEmails({
        input: {
          firstName: this.props.firstName,
          lastName: this.props.lastName,
          email: this.props.email
        },
        oldMessages: this.props.messages || [],
        id: this.props.id
      })
    }
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  addNewFile = file => {
    this.setState(state => ({ newFiles: [...state.newFiles, file] }))
  }
  updateProfile() {
    const input = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email
    }
    const messages = this.props.messages.map(message => {
      const { __typename, ...rest } = message
      return rest
    })
    const savedFiles = this.state.savedFiles.map(file => {
      const { __typename, ...rest } = file
      return rest
    })
    if (this.props.mutationTarget === "me") {
      this.props.update({ variables: { input } })
    } else if (this.props.mutationTarget === "user") {
      this.props.update({
        variables: {
          id: this.props.id,
          input,
          messages,
          newFiles: this.state.newFiles,
          savedFiles
        }
      })
    }
  }
  render() {
    const { classes } = this.props
    return (
      <Fragment>
        <Typography variant="display1" className={classes.heading}>
          Profile
        </Typography>
        <StyledCard>
          <CardContent>
            <FormControl margin="dense">
              <div>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  margin="dense"
                  className={classes.textField}
                  value={this.state.firstName}
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  margin="dense"
                  className={classes.textField}
                  value={this.state.lastName}
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  id="email"
                  name="email"
                  label="Email"
                  margin="dense"
                  className={classes.textField}
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </div>
              {this.props.mutationTarget === "user" && (
                <UserFiles addNewFile={this.addNewFile} {...this.state} />
              )}
            </FormControl>
          </CardContent>
          <CardActions>
            <Button
              variant="raised"
              color="primary"
              onClick={this.updateProfile}
            >
              Update
            </Button>
            <Button color="primary" component={Link} to="/">
              Home
            </Button>
          </CardActions>
        </StyledCard>
      </Fragment>
    )
  }
}

const StyledProfile = withStyles(styles)(Profile)

export default StyledProfile
