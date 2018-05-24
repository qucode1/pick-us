import React, { Fragment, Component } from "react"
import { Query, Mutation, withApollo } from "react-apollo"
import gql from "graphql-tag"
import { Link, Redirect, Route } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Button from "material-ui/Button"
import TextField from "material-ui/TextField"

import Loading from "../loading/Loading"

import { ADDUSER } from "../../mutations/user"
import { EMAILHISTORY } from "../../queries/email"

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

const EmailHistory = ({ email }) => (
  <Query
    query={EMAILHISTORY}
    variables={{ q: { email, includeSentEmails: true } }}
  >
    {({ loading, error, data }) => {
      if (loading) return <Loading />
      else if (error) {
        return (
          <MyContext.Consumer>
            {context => (
              <Fragment>
                {context.setError(error)}
                <Redirect to="/error" />
              </Fragment>
            )}
          </MyContext.Consumer>
        )
      } else {
        return (
          <Fragment>
            {data.emails &&
              data.emails.messages &&
              data.emails.messages.map(message => (
                <p key={message.decoded.id}>{message.decoded.subject}</p>
              ))}
          </Fragment>
        )
      }
    }}
  </Query>
)

class AddUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: "",
      lastName: "",
      email: ""
    }
  }
  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    })
  }
  render() {
    const { classes } = this.props
    const { firstName, lastName, email } = this.state
    return (
      <Mutation
        mutation={ADDUSER}
        update={(cache, { data: { addUser } }) => {
          const { allUsers } = cache.readQuery({
            query: gql`
              query allUsers {
                allUsers(limit: 10, skip: 0) {
                  id
                  firstName
                  lastName
                  email
                  role
                }
              }
            `
          })
          cache.writeQuery({
            query: gql`
              query allUsers {
                allUsers(limit: 10, skip: 0) {
                  id
                  firstName
                  lastName
                  email
                  role
                }
              }
            `,
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
                        <EmailHistory email={this.state.email} />
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
