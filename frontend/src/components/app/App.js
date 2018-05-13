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
import Profile from "../profile/Profile"
import Landing from "../landing/Landing"
import ErrorComponent from "../error/Error"
import Header from "../header/Header"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: !!localStorage.getItem("idToken"),
      error: null
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
  login = async () => {
    // this.props.history.push("/login")
    loginUser(Lock)
    Lock.on("authenticated", authResult => {
      console.log("login authResult", authResult)
      Lock.getUserInfo(authResult.accessToken, async (err, profile) => {
        if (err) console.error("App.login", err)
        // console.log("login authenticated profile", profile)
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
    })
  }
  logout = () => {
    logoutUser()
    this.setState({
      isLoggedIn: false
    })
    this.props.client.resetStore()
    this.props.history.push("/logout")
  }
  render() {
    return (
      <MyContext.Provider
        value={{
          state: this.state,
          setError: this.setError
        }}
      >
        <div className="App">
          <Header
            login={this.login}
            logout={this.logout}
            isLoggedIn={this.state.isLoggedIn}
          />
          <Route
            exact
            path="/"
            component={this.state.isLoggedIn ? Dashboard : Landing}
          />
          <Switch>
            <PrivateRoute exact path="/profile" component={Profile} />
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
              render={() => {
                this.setError({ message: "There is nothing to see here :(" })
                return <Redirect to="/error" />
              }}
            />
          </Switch>
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

export default withApollo(withRouter(App))
