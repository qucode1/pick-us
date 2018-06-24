import React, { Fragment } from "react"
import { Query } from "react-apollo"
import { Link, Redirect } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Button from "@material-ui/core/Button"

import StyledCard from "../styledCard/StyledCard"

import { ALLUSERS } from "../../queries/user"

const styles = theme => ({
  heading: {
    textAlign: "center",
    margin: theme.spacing.unit * 2
  }
})

const LatestUsers = ({ classes }) => {
  return (
    <Query query={ALLUSERS} variables={{ limit: 5, skip: 0 }}>
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
              <StyledCard>
                <CardContent>
                  <Typography variant="title">Neuste Nutzer:</Typography>
                  {allUsers.map(user => (
                    <Fragment key={user.id}>
                      <Button
                        color="primary"
                        component={Link}
                        to={`/users/${user.id}`}
                      >
                        <Typography variant="subheading">
                          {user.firstName} {user.lastName} - {user.email}
                        </Typography>
                      </Button>
                    </Fragment>
                  ))}
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    variant="raised"
                    component={Link}
                    to="/users/add"
                  >
                    Add User
                  </Button>
                </CardActions>
              </StyledCard>
            </Fragment>
          )
        }
      }}
    </Query>
  )
}

export default withStyles(styles)(LatestUsers)
