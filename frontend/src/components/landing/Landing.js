import React, { Fragment } from "react"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Button from "@material-ui/core/Button"

import StyledCard from "../styledCard/StyledCard"

const styles = theme => ({
  content: {
    textAlign: "center"
  },
  heading: {
    textAlign: "center",
    margin: theme.spacing.unit * 2
  },
  actions: {
    justifyContent: "center"
  }
})

const Landing = ({ classes }) => (
  <Fragment>
    <Typography className={classes.heading} variant="display1">
      Pick Us NRW - Job Platform
    </Typography>
    <StyledCard>
      <CardContent className={classes.content}>
        <Typography variant="title">
          Willkommen auf unserer Job Platform!
        </Typography>
        <Typography variant="subheading">
          Sie möchten sich für einen Job oder eine Schulung bewerben?
          Registrieren Sie sich jetzt!{" "}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <MyContext.Consumer>
          {context => (
            <Button color="primary" variant="raised" onClick={context.login}>
              Sign Up
            </Button>
          )}
        </MyContext.Consumer>
      </CardActions>
    </StyledCard>
  </Fragment>
)

export default withStyles(styles)(Landing)
