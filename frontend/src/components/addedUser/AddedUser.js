import React, { Fragment } from "react"
import { Link, Redirect } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Button from "material-ui/Button"
import TextField from "material-ui/TextField"
import lightGreen from "material-ui/colors/lightGreen"

import Loading from "../loading/Loading"

const success = lightGreen[500]

const styles = theme => ({
  card: {
    margin: "auto",
    width: "75%",
    maxWidth: "800px",
    [theme.breakpoints.down("md")]: {
      width: "95%"
    }
  },
  message: {
    color: success
  },
  heading: {
    textAlign: "center",
    margin: theme.spacing.unit * 2
  }
})

const AddedUser = ({ classes, user: { firstName, lastName, id } = {} }) => (
  <Fragment>
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="subheading" className={classes.message}>
          {firstName ? `${firstName} ${lastName}` : "User"} successfully added!
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="raised"
          color="primary"
          component={Link}
          to="/users/add"
        >
          Add Another User
        </Button>
        <Button color="primary" component={Link} to={`/users/${id}`}>
          User Profile
        </Button>
        <Button color="primary" component={Link} to="/">
          Home
        </Button>
      </CardActions>
    </Card>
  </Fragment>
)

export default withStyles(styles)(AddedUser)
