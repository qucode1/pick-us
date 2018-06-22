import React, { Fragment, Component } from "react"
import { Mutation, withApollo } from "react-apollo"
import { Link, Redirect } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Button from "material-ui/Button"
import TextField from "material-ui/TextField"
import FormControl from "@material-ui/core/FormControl"

import Loading from "../loading/Loading"
import EmailHistory from "../emailHistory/EmailHistory"
import UserFiles from "../userFiles/UserFiles"

import { ADDUSER } from "../../mutations/user"
import { EMAILHISTORY } from "../../queries/email"
import { ALLUSERS } from "../../queries/user"

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  card: {
    // position: "relative",
    margin: `${theme.spacing.unit * 2}px auto`,
    width: "75%",
    maxWidth: "800px",
    [theme.breakpoints.down("md")]: {
      width: "95%"
    }
  },
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

class AddUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      messages: [],
      newFiles: [],
      fetchingEmails: false
    }
  }
  handleChange = ({ target: { name, value } }) => {
    this.setState(
      oldState => ({
        [name]: value
      }),
      () => {
        if (name === "email") {
          if (value) {
            clearTimeout(this.emailTimeout)
            this.emailTimeout = setTimeout(this.getMatchingEmails, 500)
          } else {
            clearTimeout(this.emailTimeout)
            this.setState({ messages: [] })
          }
        }
      }
    )
  }

  addNewFile = file => {
    this.setState(state => ({ newFiles: [...state.newFiles, file] }))
  }

  getMatchingEmails = () => {
    try {
      this.setState(
        () => ({
          fetchingEmails: true
        }),
        async () => {
          const {
            data: { emails: { messages } }
          } = await this.props.client.query({
            query: EMAILHISTORY,
            variables: {
              q: { email: this.state.email, includeSentEmails: true }
            }
          })
          let decoded = messages.map(message => ({ ...message.decoded }))
          this.setState({ messages: decoded, fetchingEmails: false })
        }
      )
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  render() {
    const { classes } = this.props
    const { firstName, lastName, email, messages, newFiles } = this.state
    return (
      <Mutation
        mutation={ADDUSER}
        update={(cache, { data: { addUser } }) => {
          const { allUsers } = cache.readQuery({
            query: ALLUSERS,
            variables: { limit: 5, skip: 0 }
          })
          cache.writeQuery({
            query: ALLUSERS,
            variables: { limit: 5, skip: 0 },
            data: {
              allUsers: [addUser, ...allUsers]
            }
          })
        }}
      >
        {(addUser, { loading, error, data }) => {
          return (
            <Fragment>
              <Typography variant="display1" className={classes.heading}>
                Add User
              </Typography>
              <form
                className={classes.root}
                onSubmit={e => {
                  e.preventDefault()
                  addUser({
                    variables: {
                      input: { firstName, lastName, email },
                      messages: messages.map(message => {
                        const { __typename, ...rest } = message
                        return rest
                      }),
                      files: newFiles
                    }
                  })
                }}
              >
                <Card className={classes.card}>
                  <FormControl margin="dense">
                    {loading && <Loading />}
                    {error && (
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
                    )}
                    <CardContent>
                      {data ? (
                        <Fragment>
                          <Typography variant="subheading">
                            {data.addUser.firstName} {data.addUser.lastName}{" "}
                            successfully added!
                          </Typography>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <TextField
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={this.state.firstName}
                            onChange={this.handleChange}
                            margin="dense"
                            type="text"
                            required
                            autoFocus
                            className={classes.textField}
                          />
                          <TextField
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={this.state.lastName}
                            onChange={this.handleChange}
                            margin="dense"
                            type="text"
                            required
                            className={classes.textField}
                          />
                          <TextField
                            id="email"
                            name="email"
                            label="Email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            margin="dense"
                            type="email"
                            required
                            className={classes.textField}
                          />
                          <UserFiles
                            {...this.state}
                            addNewFile={this.addNewFile}
                          />
                        </Fragment>
                      )}
                    </CardContent>
                    <CardActions>
                      {data ? (
                        <MyContext.Consumer>
                          {context => {
                            return (
                              <Fragment>
                                {context.setAddedUser(data.addUser)}
                                <Redirect to="/users/add/success" />
                              </Fragment>
                            )
                          }}
                        </MyContext.Consumer>
                      ) : (
                        <Button variant="raised" color="primary" type="submit">
                          Add User
                        </Button>
                      )}
                      <Button color="primary" component={Link} to="/">
                        Home
                      </Button>
                    </CardActions>
                  </FormControl>
                </Card>
              </form>
              <EmailHistory
                fetchingEmails={this.state.fetchingEmails}
                messages={this.state.messages}
                email={this.state.email}
              />
            </Fragment>
          )
        }}
      </Mutation>
    )
  }
}

export default withApollo(withStyles(styles)(AddUser))
