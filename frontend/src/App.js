import React, { Component, Fragment } from "react"
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  Switch
} from "react-router-dom"
import yoga from "./yoga.png"
import "./App.css"
// import gql from 'graphql-tag'
// import { graphql } from 'react-apollo'
import Lock, { loginUser, logoutUser } from "./utils/auth"

import Callback from "./Callback"
import ErrorComponent from "./Error"

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
      this.setState({
        isLoggedIn: true
      })
      this.props.history.push("/")
    })
  }
  logout() {
    logoutUser()
    this.setState({
      isLoggedIn: false
    })
  }
  render() {
    // if (this.props.data.loading) {
    //   return <div>Loading</div>
    // }
    return (
      <Router>
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
            render={() => (
              <div className="App-intro">
                <h3>Test</h3>
                <Link to="/callback">Callback</Link>
              </div>
            )}
          />
          <Route exact path="/error" component={ErrorComponent} />
          <Switch>
            {this.state.isLoggedIn && (
              <Route exact path="/callback" component={Callback} />
            )}
            <Route
              exact
              path="/:anythingElse"
              render={() => <Redirect to="/error" />}
            />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default withRouter(App)
