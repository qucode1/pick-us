import React, { Component } from "react"
import { Route, Switch, Redirect, withRouter } from "react-router-dom"
import gql from "graphql-tag"

import "./App.css"
import Lock, { loginUser, logoutUser } from "../../utils/auth"
import { withApollo } from "react-apollo"
import { MyContext } from "../../utils/contextProvider"
import PrivateRoute from "../../utils/PrivateRoute"

import Callback from "../callback/Callback"
import Dashboard from "../dashboard/Dashboard"
import MyProfile from "../myProfile/myProfile"
import Landing from "../landing/Landing"
import ErrorComponent from "../error/Error"
import Header from "../header/Header"
import AddUser from "../addUser/AddUser"
import AddedUser from "../addedUser/AddedUser"
import UserProfile from "../userProfile/UserProfile"

import logo from "../../bgLogo.svg"

import { withStyles } from "@material-ui/core/styles"
import Navigation from "../navigation/Navigation"

const styles = theme => ({
  root: {
    height: "100%",
    minHeight: "100vH",
    backgroundColor: "rgba(61, 110, 191, .05)",
    position: "relative"
  },
  background: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: "-1",
    backgroundImage: `url("${logo}")`,
    backgroundSize: "80vH",
    backgroundRepeat: "no-repeat",
    backgroundOrigin: "border-box",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    filter: "opacity(.1) drop-shadow(1px 1px 3px dimgrey)"
  },
  main: {
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing.drawerWidth
    }
  },
  toolbar: theme.mixins.toolbar
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: !!localStorage.getItem("idToken"),
      error: null,
      addedUser: undefined,
      firstLogin: true,
      newUserEmailHistory: [],
      mobileNavOpen: false
    }
    this.logout = this.logout.bind(this)
    this.setError = this.setError.bind(this)
  }
  componentDidMount() {
    // this.setState({
    //   isLoggedIn: !!localStorage.getItem("idToken")
    // })
  }
  setError(e) {
    this.setState({
      error: e
    })
  }
  setAddedUser = user => {
    this.setState({
      addedUser: user
    })
  }
  setNewUserEmailHistory = (emails = []) => {
    this.setState({
      newUserEmailHistory: emails
    })
  }
  toggleMobileNav = () => {
    this.setState({
      mobileNavOpen: !this.state.mobileNavOpen
    })
  }
  login = async () => {
    loginUser(Lock)
    // prevent adding multiple identical eventListeners if not 1st login
    if (this.state.firstLogin) {
      Lock.on("authenticated", authResult => {
        if (!localStorage.getItem("idToken")) {
          Lock.getUserInfo(authResult.accessToken, async (err, profile) => {
            if (err) console.error("App.login", err)
            localStorage.setItem("idToken", authResult.idToken)
            localStorage.setItem("accessToken", authResult.accessToken)
            await this.props.client.resetStore()
            const {
              data: { me: { profileToken } }
            } = await this.props.client.query({
              query: gql`
                {
                  me {
                    id
                    profileToken
                    firstName
                    lastName
                    email
                    auth0
                    role
                  }
                }
              `
            })
            localStorage.setItem("profileToken", profileToken)
            this.setState(
              () => ({
                isLoggedIn: true
              }),
              this.props.history.push("/")
            )
          })
        }
      })
      this.setState({ firstLogin: false })
    }
  }
  logout = async () => {
    logoutUser()
    this.setState({
      isLoggedIn: false
    })
    await this.props.client.resetStore()
    this.props.history.push("/")
  }
  render() {
    return (
      <MyContext.Provider
        value={{
          state: this.state,
          setError: this.setError,
          setAddedUser: this.setAddedUser,
          login: this.login,
          setNewUserEmailHistory: this.setNewUserEmailHistory
        }}
      >
        <div className={this.props.classes.root}>
          <div className={this.props.classes.background} />
          <Header
            login={this.login}
            logout={this.logout}
            isLoggedIn={this.state.isLoggedIn}
            toggleMobileNav={this.toggleMobileNav}
          />
          <Navigation
            mobileNavOpen={this.state.mobileNavOpen}
            toggleMobileNav={this.toggleMobileNav}
          />
          <main className={this.props.classes.main}>
            <div className={this.props.classes.toolbar} />
            <Route
              exact
              path="/"
              component={this.state.isLoggedIn ? Dashboard : Landing}
            />
            <Switch>
              <PrivateRoute exact path="/profile" component={MyProfile} />
              <PrivateRoute exact path="/users/add" component={AddUser} />
              <PrivateRoute
                exact
                path="/users/add/success"
                component={AddedUser}
              />
              <PrivateRoute exact path="/users/:id" component={UserProfile} />
              <PrivateRoute exact path="/callback" component={Callback} />
              <Route exact path="/error" component={ErrorComponent} />
              <Route
                exact
                path="/login"
                render={() => <Login login={this.login} />}
              />
              <Route exact path="/logout" render={() => <Redirect to="/" />} />
              <Route
                exact
                path="/:anythingElse"
                render={() => (
                  <ErrorComponent errorProp="There is nothing to see here :(" />
                )}
              />
            </Switch>
          </main>
        </div>
      </MyContext.Provider>
    )
  }
}

class Login extends Component {
  componentDidMount() {
    this.props.login()
  }
  render() {
    return <p>Logging in...</p>
  }
}

export default withApollo(withRouter(withStyles(styles)(App)))
