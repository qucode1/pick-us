import React, { Component, Fragment } from "react"
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

// import pickUsLogo from "../../logo.svg"

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
    height: "40px",
    margin: `0 ${theme.spacing.unit}px`
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  logoutText: {
    color: theme.palette.error.light
  }
})

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null
    }
  }
  handleUserMenuClick = e => {
    this.setState({
      anchorEl: e.currentTarget
    })
  }
  handleUserMenuClose = () => {
    this.setState({ anchorEl: null })
  }
  handleUserMenuLogout = () => {
    this.handleUserMenuClose()
    this.props.logout()
  }
  render() {
    const { anchorEl } = this.state
    const { isLoggedIn } = this.props
    return (
      <Fragment>
        {isLoggedIn ? (
          <Query query={ME}>
            {({ loading, error, data }) => {
              if (loading) return <Loading />
              else if (error) {
                console.log("header error", error)
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
                  <header className={this.props.classes.root}>
                    <AppBar position="static">
                      <Toolbar>
                        {this.props.isLoggedIn && (
                          <IconButton
                            className={this.props.classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                          >
                            =
                          </IconButton>
                        )}
                        {/* <img
                        src={pickUsLogo}
                        className={this.props.classes.logo}
                        alt="logo"
                      /> */}
                        <Typography
                          variant="title"
                          color="inherit"
                          className={this.props.classes.flex}
                        >
                          Pick Us NRW
                        </Typography>
                        {this.props.isLoggedIn && (
                          <Fragment>
                            <IconButton
                              // component={Link}
                              // to="/profile"
                              color="inherit"
                              aria-owns={anchorEl ? "User Menu" : null}
                              aria-haspopup="true"
                              onClick={this.handleUserMenuClick}
                            >
                              {data.me.firstName[0]}
                              {data.me.lastName[0]}
                            </IconButton>
                            <Menu
                              id="userMenu"
                              anchorEl={anchorEl}
                              open={!!anchorEl}
                              onClose={this.handleUserMenuClose}
                            >
                              <MenuItem
                                component={Link}
                                to="/"
                                onClick={this.handleUserMenuClose}
                              >
                                Dashboard
                              </MenuItem>
                              <MenuItem
                                component={Link}
                                to="/profile"
                                onClick={this.handleUserMenuClose}
                              >
                                Profile
                              </MenuItem>
                              <MenuItem
                                className={this.props.classes.logoutText}
                                onClick={this.handleUserMenuLogout}
                              >
                                Logout
                              </MenuItem>
                            </Menu>
                          </Fragment>
                        )}
                        <Button
                          color="inherit"
                          onClick={
                            this.props.isLoggedIn
                              ? this.props.logout
                              : this.props.login
                          }
                        >
                          {this.props.isLoggedIn ? "Logout" : "Login"}
                        </Button>
                      </Toolbar>
                    </AppBar>
                  </header>
                )
              }
            }}
          </Query>
        ) : (
          <header className={this.props.classes.root}>
            <AppBar position="static">
              <Toolbar>
                <Typography
                  variant="title"
                  color="inherit"
                  className={this.props.classes.flex}
                >
                  Pick Us NRW
                </Typography>
                <Button color="inherit" onClick={this.props.login}>
                  Login
                </Button>
              </Toolbar>
            </AppBar>
          </header>
        )}
      </Fragment>
    )
  }
}

export default withStyles(styles)(Header)
