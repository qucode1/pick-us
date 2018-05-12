import React, { Fragment, Component } from "react"
import { Link, Redirect } from "react-router-dom"
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag"

import { MyContext } from "../../utils/contextProvider"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Typography from "material-ui/Typography"
import TextField from "material-ui/TextField"
import Button from "material-ui/Button"

const ME = gql`
  {
    me {
      id
      firstName
      lastName
      email
      auth0
      role
    }
  }
`
const UPDATE_ME = gql`
  mutation updateMe($input: UserInput!) {
    updateMe(input: $input) {
      id
      firstName
      lastName
      email
      role
      auth0
    }
  }
`

const ProfileQueryWrapper = props => (
  <Query query={ME}>
    {({ loading, error, data }) => {
      if (loading) return "Loading..."
      if (error) {
        return (
          <Fragment>
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
          </Fragment>
        )
      }
      console.log("profileQueryWrapper data: ", data)
      if (!localStorage.getItem("profileToken")) {
        localStorage.setItem("profileToken", data.me.profileToken)
      }
      return <Profile {...props} {...data.me} />
    }}
  </Query>
)

const ProfileMutationWrapper = props => (
  <Mutation
    mutation={UPDATE_ME}
    // update={(cache, { data: { updateMe } }) => {
    //   const { me } = cache.readQuery({ query: ME })
    //   console.dir({ ...me, ...updateMe })
    //   cache.writeQuery({
    //     query: ME,
    //     data: {
    //       me: {
    //         ...me,
    //         firstName: updateMe.firstName,
    //         lastName: updateMe.lastName,
    //         email: updateMe.email,
    //         __typename: updateMe.__typename
    //       }
    //     }
    //   })
    // }}
  >
    {(updateMe, { loading, error, data }) => {
      if (loading) return <h3>Loading...</h3>
      else if (error)
        return (
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
        )
      else if (data)
        return <ProfileQueryWrapper {...props} updateMe={updateMe} />
      else return <ProfileQueryWrapper {...props} updateMe={updateMe} />
    }}
  </Mutation>
)
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
      email: this.props.email
    })
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  updateProfile() {
    this.props.updateMe({
      variables: {
        input: {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email
        }
      }
    })
  }
  render() {
    return (
      <Fragment>
        <Typography variant="display1">Profile</Typography>
        <Card>
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
        {/* <h2>Profile Component</h2>
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={this.state.firstName}
          onChange={this.handleChange}
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={this.state.lastName}
          onChange={this.handleChange}
        />
        <input
          type="email"
          placeholder="your@email.com"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <button onClick={this.updateProfile}>Update Profile</button>
        <Link to="/">Home</Link> */}
      </Fragment>
    )
  }
}

export default ProfileMutationWrapper
