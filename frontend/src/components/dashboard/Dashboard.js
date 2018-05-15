import React, { Fragment } from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Link, Redirect } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Card, { CardActions, CardContent } from "material-ui/Card"
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

const styles = theme => ({
  heading: {
    marginTop: "10px",
    marginBottom: "10px"
  },
  userInfo: {
    display: "inline-block",
    width: "80vW",
    maxWidth: "700px"
    // minWidth: "200px"
  }
})

const Dashboard = props => {
  return (
    <Query query={ME}>
      {({ loading, error, data }) => {
        if (loading) return "Loading..."
        else if (error) {
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
        } else {
          let response
          // localStorage.setItem("profileToken", data.me.profileToken)
          if (data.me.role === "tempUser" || data.me.role === "newUser") {
            response = <Redirect to="/profile" />
          } else
            response = (
              <Fragment>
                <Typography
                  className={props.classes.heading}
                  variant="display1"
                >
                  Dashboard
                </Typography>
                <Card className={props.classes.userInfo}>
                  <CardContent>
                    <Typography variant="title">
                      {data.me.firstName} {data.me.lastName}
                    </Typography>
                    <Typography variant="subheading">
                      {data.me.email}
                    </Typography>
                    <Typography variant="subheading">{data.me.role}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={Link} to="/profile">
                      Profile
                    </Button>
                  </CardActions>
                </Card>
              </Fragment>
            )
          return response
        }
      }}
    </Query>
  )
}

export default withStyles(styles)(Dashboard)