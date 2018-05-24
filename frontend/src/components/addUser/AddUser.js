import React, { Fragment, Component } from "react"
import { Mutation, withApollo } from "react-apollo"
import { Link, Redirect } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Button from "material-ui/Button"
import TextField from "material-ui/TextField"

import Loading from "../loading/Loading"

import { ADDUSER } from "../../mutations/user"
import { EMAILHISTORY } from "../../queries/email"
import { ALLUSERS } from "../../queries/user"

const styles = theme => ({
  card: {
    position: "relative",
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

const EmailHistory = ({ messages, fetchingEmails }) => (
  <div style={{ position: "relative", minHeight: "50px" }}>
    {messages &&
      messages.length > 0 &&
      messages.map(message => (
        <p key={message.decoded.id}>{message.decoded.subject}</p>
      ))}
    {fetchingEmails && <Loading />}
  </div>
)

class AddUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      messages: [],
      fetchingEmails: false
    }
  }
  handleChange = ({ target: { name, value } }) => {
    this.setState(
      oldState => ({
        [name]: value
      }),
      () => {
        if (value) {
          if (name === "email") {
            clearTimeout(this.emailTimeout)
            this.emailTimeout = setTimeout(this.getMatchingEmails, 500)
          }
        } else {
          clearTimeout(this.emailTimeout)
          this.setState({ messages: [] })
        }
      }
    )
  }

  getMatchingEmails = () => {
    this.setState(
      () => ({
        fetchingEmails: true
      }),
      async () => {
        const {
          data: { emails: { messages } }
        } = await this.props.client.query({
          query: EMAILHISTORY,
          variables: { q: { email: this.state.email, includeSentEmails: true } }
        })
        this.setState({ messages, fetchingEmails: false })
      }
    )
  }

  render() {
    const { classes } = this.props
    const { firstName, lastName, email } = this.state
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
              <form>
                <Card className={classes.card}>
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
                          margin="normal"
                        />
                        <TextField
                          id="lastName"
                          name="lastName"
                          label="Last Name"
                          value={this.state.lastName}
                          onChange={this.handleChange}
                          margin="normal"
                        />
                        <TextField
                          id="email"
                          name="email"
                          label="Email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          margin="normal"
                        />
                        <EmailHistory
                          fetchingEmails={this.state.fetchingEmails}
                          messages={this.state.messages}
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
                      <Button
                        variant="raised"
                        color="primary"
                        onClick={e => {
                          e.preventDefault()
                          addUser({
                            variables: {
                              input: { firstName, lastName, email }
                            }
                          })
                        }}
                      >
                        Add User
                      </Button>
                    )}
                    <Button color="primary" component={Link} to="/">
                      Home
                    </Button>
                  </CardActions>
                </Card>
              </form>
            </Fragment>
          )
        }}
      </Mutation>
    )
  }
}

export default withApollo(withStyles(styles)(AddUser))
