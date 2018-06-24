import React, { Fragment } from "react"
import { Link, Redirect } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "@material-ui/core/styles"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

import StyledCard from "../styledCard/StyledCard"

const styles = theme => ({
  heading: {
    textAlign: "center",
    margin: theme.spacing.unit * 2
  }
})

const ErrorComponent = ({ classes, errorProp }) => (
  <Fragment>
    <Typography className={classes.heading} variant="display1">
      Error
    </Typography>
    <StyledCard>
      <CardContent>
        <MyContext.Consumer>
          {({ state: { error } }) => {
            if (
              error &&
              error.graphQLErrors &&
              error.graphQLErrors.length > 0
            ) {
              return handleFirstError(error.graphQLErrors[0])
            } else if (error) {
              return (
                <Typography variant="subheading">{error.message}</Typography>
              )
            } else if (errorProp) {
              return <Typography variant="subheading">{errorProp}</Typography>
            }
            return (
              <Typography variant="subheading">
                Sorry, something went wrong :(
              </Typography>
            )
          }}
        </MyContext.Consumer>
      </CardContent>
      <CardActions>
        <Button component={Link} to="/" color="primary" variant="raised">
          Home
        </Button>
      </CardActions>
    </StyledCard>
  </Fragment>
)

export default withStyles(styles)(ErrorComponent)

const handleFirstError = err => {
  switch (err.name) {
    case "No User Data":
    case "Duplicate Email":
      return <Redirect push to="/profile" />
    case "Not Logged In":
      return <Redirect push to="/" />
    case "Not Authorized":
    case "Custom Error":
    default:
      return (
        <Fragment>
          <Typography variant="subheading">{err.name}</Typography>
          <Typography variant="subheading">{err.message}</Typography>
        </Fragment>
      )
  }
}
