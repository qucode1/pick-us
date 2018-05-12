import React, { Fragment } from "react"
import { Redirect, Link } from "react-router-dom"
import { Query } from "react-apollo"
import gql from "graphql-tag"

import Loading from "../loading/Loading"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "material-ui/styles/"
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import IconButton from "material-ui/IconButton"
import Button from "material-ui/Button"
import Typography from "material-ui/Typography"
import Menu, { MenuItem } from "material-ui/Menu"

// import pickUsLogo from "../../pickus-template.svg"

const ME = gql`
  {
    me {
      id
      firstName
      lastName
    }
  }
`

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  logo: {
    height: "60px"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
})

const Header = props => (
  // props.isLoggedIn ? (
  <Query query={ME}>
    {({ loading, error, data }) => {
      if (loading) return <Loading />
      else if (error) {
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
      } else {
        return (
          <header className={props.classes.root}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  className={props.classes.menuButton}
                  color="inherit"
                  aria-label="Menu"
                >
                  =
                </IconButton>
                {/* <img
                  src={pickUsLogo}
                  className={props.classes.logo}
                  alt="logo"
                /> */}
                <Typography
                  variant="title"
                  color="inherit"
                  className={props.classes.flex}
                >
                  Pick Us NRW
                </Typography>
                {props.isLoggedIn && (
                  <IconButton
                    component={Link}
                    to="/profile"
                    color="inherit"
                    aria-label="Menu"
                  >
                    {data.me.firstName[0]}
                    {data.me.lastName[0]}
                  </IconButton>
                )}
                <Button
                  color="inherit"
                  onClick={props.isLoggedIn ? props.logout : props.login}
                >
                  {props.isLoggedIn ? "Logout" : "Login"}
                </Button>
              </Toolbar>
            </AppBar>
          </header>
        )
      }
    }}
  </Query>
)

export default withStyles(styles)(Header)
