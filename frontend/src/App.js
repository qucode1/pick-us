import React, { Component, Fragment } from "react"
import { Route, withRouter, Switch } from "react-router-dom"
import yoga from "./yoga.png"
import "./App.css"
import Lock, { loginUser, logoutUser } from "./utils/auth"
import { withApollo } from "react-apollo"
import { MyContext } from "./utils/contextProvider"
import PrivateRoute from "./utils/PrivateRoute"

import Callback from "./Callback"
import Dashboard from "./Dashboard"
import Profile from "./Profile"
import Landing from "./Landing"
import ErrorComponent from "./Error"
import Redirect from "react-router-dom/Redirect"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      error: null
    }
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.setError = this.setError.bind(this)
  }
  componentDidMount() {
    this.setState({
      isLoggedIn: !!localStorage.getItem("idToken")
    })
  }
  setError(e) {
    this.setState({
      error: e
    })
  }
  login() {
    // this.props.history.push("/login")
    loginUser(Lock)
    Lock.on("authenticated", authResult => {
      console.log("login authResult", authResult)
      Lock.getUserInfo(authResult.accessToken, (err, profile) => {
        if (err) console.error("App.login", err)
        // console.log("login authenticated profile", profile)
        localStorage.setItem("idToken", authResult.idToken)
        localStorage.setItem("accessToken", authResult.accessToken)
        this.setState(
          () => ({
            isLoggedIn: true
          }),
          this.props.history.push("/")
        )
      })
    })
  }
  logout() {
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
          <header className="App-header">
            <img src={yoga} className="App-logo" alt="logo" />
            <h1 className="App-title">
              Welcome to <code>graphql-yoga</code>
            </h1>
            {this.state.isLoggedIn ? (
              <button onClick={this.logout}>Logout</button>
            ) : (
              <button onClick={this.login}>Login</button>
            )}
          </header>
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
              render={() => (
                this.setError({ message: "There is nothing to see here :(" }),
                <Redirect to="/error" />
              )}
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
