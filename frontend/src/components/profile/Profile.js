import React, { Fragment, Component } from "react"
import { Link } from "react-router-dom"

import { withStyles } from "material-ui/styles"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Typography from "material-ui/Typography"
import TextField from "material-ui/TextField"
import Button from "material-ui/Button"

const styles = theme => ({
  card: {
    margin: "auto",
    width: "75%",
    maxWidth: "800px",
    [theme.breakpoints.down("md")]: {
      width: "95%"
    }
  },
  heading: {
    textAlign: "center",
    margin: theme.spacing.unit * 2
  }
})

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: "",
      lastName: "",
      email: ""
    }
    this.handleChange = this.handleChange.bind(this)
    this.updateProfile = this.updateProfile.bind(this)
  }
  componentDidMount() {
    this.setState({
      firstName: this.props.firstName || "",
      lastName: this.props.lastName || "",
      email: this.props.email || "",
      messages: this.props.messages || []
    })
    this.props.getNewEmails({
      email: this.props.email,
      oldMessages: this.props.messages || []
    })
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
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
    if (this.props.mutationTarget === "me") {
      this.props.update({ variables: { input } })
    } else if (this.props.mutationTarget === "user") {
      this.props.update({ variables: { input, messages, id: this.props.id } })
    }
  }
  render() {
    const { classes } = this.props
    return (
      <Fragment>
        <Typography variant="display1" className={classes.heading}>
          Profile
        </Typography>
        <Card className={classes.card}>
          <CardContent>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="First Name"
              value={this.state.firstName}
              onChange={this.handleChange}
            />
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last Name"
              value={this.state.lastName}
              onChange={this.handleChange}
            />
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              value={this.state.email}
              onChange={this.handleChange}
            />
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
        </Card>
      </Fragment>
    )
  }
}

const StyledProfile = withStyles(styles)(Profile)

export default StyledProfile
