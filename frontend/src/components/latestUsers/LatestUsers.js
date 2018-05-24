import React, { Fragment } from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Link, Redirect } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Button from "material-ui/Button"

import { ALLUSERS } from "../../queries/user"

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

const LatestUsers = ({ classes }) => {
  return (
    <Query query={ALLUSERS} variables={{ limit: 10, skip: 0 }}>
      {({ loading, error, data: { allUsers } }) => {
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
          return (
            <Fragment>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="title">Neuste Nutzer:</Typography>
                  {allUsers.map(user => (
                    <Fragment key={user.id}>
                      <Typography variant="subheading">
                        {user.firstName} {user.lastName} - {user.email} -{" "}
                        {user.role}
                      </Typography>
                    </Fragment>
                  ))}
                </CardContent>
                <CardActions>
                  <Button color="primary" component={Link} to="/users/add">
                    Add User
                  </Button>
                </CardActions>
              </Card>
            </Fragment>
          )
        }
      }}
    </Query>
  )
}

export default withStyles(styles)(LatestUsers)
