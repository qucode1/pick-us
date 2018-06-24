import React, { Fragment } from "react"
import { Link } from "react-router-dom"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Button from "@material-ui/core/Button"
import lightGreen from "@material-ui/core/colors/lightGreen"

import StyledCard from "../styledCard/StyledCard"

const success = lightGreen[500]

const styles = theme => ({
  message: {
    color: success
  },
  heading: {
    textAlign: "center",
    margin: theme.spacing.unit * 2
  }
})

const AddedUser = ({ classes }) => (
  <Fragment>
    <Typography variant="display1" className={classes.heading}>
      User Added
    </Typography>
    <MyContext.Consumer>
      {({
        state: { addedUser: { firstName, lastName, id } = {}, setAddedUser }
      }) => (
        <StyledCard>
          <CardContent>
            <Typography variant="subheading" className={classes.message}>
              {firstName ? `${firstName} ${lastName}` : "User"} successfully
              added!
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
        </StyledCard>
      )}
    </MyContext.Consumer>
  </Fragment>
)

export default withStyles(styles)(AddedUser)
