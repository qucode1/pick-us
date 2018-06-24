import React, { Fragment } from "react"
import { Query } from "react-apollo"
import { Link, Redirect } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Button from "@material-ui/core/Button"

import LatestUsers from "../latestUsers/LatestUsers"
import StyledCard from "../styledCard/StyledCard"

import { ME } from "../../queries/me"

const styles = theme => ({
  heading: {
    textAlign: "center",
    margin: theme.spacing.unit * 2
  }
})

const Dashboard = props => {
  const { classes } = props
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
                <Typography className={classes.heading} variant="display1">
                  Dashboard
                </Typography>
                <StyledCard>
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
                    <Button color="primary" component={Link} to="/profile">
                      Profile
                    </Button>
                  </CardActions>
                </StyledCard>
                <LatestUsers />
              </Fragment>
            )
          return response
        }
      }}
    </Query>
  )
}

export default withStyles(styles)(Dashboard)
