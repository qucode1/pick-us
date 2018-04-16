import React, { Component, Fragment } from "react"
import {
  BrowserRouter as Router,
  Route,
  withRouter,
  Switch
} from "react-router-dom"
import yoga from "./yoga.png"
import "./App.css"
import Lock, { loginUser, logoutUser } from "./utils/auth"

import Callback from "./Callback"
import Dashboard from "./Dashboard"
import Profile from "./Profile"
import Landing from "./Landing"
import ErrorComponent from "./Error"
// import { ErrorContext } from "./utils/contextProvider"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false
    }
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }
  componentDidMount() {
    this.setState({
      isLoggedIn: !!localStorage.getItem("idToken")
    })
  }
  login() {
    loginUser(Lock)
    Lock.on("authenticated", authResult => {
      console.log("login authResult", authResult)
      Lock.getUserInfo(authResult.accessToken, (err, profile) => {
        if (err) console.error(err)
        // console.log("login authenticated profile", profile)
        localStorage.setItem("idToken", authResult.idToken)
        localStorage.setItem("accessToken", authResult.accessToken)
        this.setState({
          isLoggedIn: true
        })
        this.props.history.push("/")
      })
    })
  }
  logout() {
    logoutUser()
    this.setState({
      isLoggedIn: false
    })
    this.props.history.push("/")
  }
  render() {
    return (
      <Router>
        {/* <ErrorContext.Provider> */}
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
          <Route exact path="/error" component={ErrorComponent} />
          <Switch>
            {this.state.isLoggedIn && (
              <Fragment>
                <Route exact path="/callback" component={Callback} />
                <Route exact path="/profile" component={Profile} />
              </Fragment>
            )}
            <Route
              exact
              path="/:anythingElse"
              render={() => (
                <ErrorComponent err="There's nothing to see here :(" />
              )}
            />
          </Switch>
        </div>
        {/* </ErrorContext.Provider> */}
      </Router>
    )
  }
}

export default withRouter(App)
