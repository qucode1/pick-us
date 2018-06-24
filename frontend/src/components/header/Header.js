import React, { Component, Fragment } from "react"
import { Redirect, Link } from "react-router-dom"
import { Query } from "react-apollo"

import Loading from "../loading/Loading"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import Hidden from "@material-ui/core/Hidden"
import Typography from "@material-ui/core/Typography"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

// import pickUsLogo from "../../logo.svg"

import { MYNAME } from "../../queries/me"

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
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
          <Query query={MYNAME}>
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
                  // <header className={this.props.classes.root}>
                  <AppBar
                    position="fixed"
                    className={this.props.classes.appBar}
                  >
                    <Toolbar>
                      {this.props.isLoggedIn && (
                        <Hidden mdUp>
                          <IconButton
                            className={this.props.classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                            onClick={this.props.toggleMobileNav}
                          >
                            =
                          </IconButton>
                        </Hidden>
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
                  // </header>
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
