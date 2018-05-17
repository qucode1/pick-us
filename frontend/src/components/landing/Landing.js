import React, { Fragment } from "react"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Button from "material-ui/Button"

const styles = theme => ({
  card: {
    textAlign: "center",
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
    <Card className={classes.card}>
      <CardContent>
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
    </Card>
  </Fragment>
)

export default withStyles(styles)(Landing)
