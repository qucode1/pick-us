import React from "react"
import { Route, Redirect } from "react-router-dom"
import { MyContext } from "./contextProvider"
import Profile from "../Profile"

const PrivateRoute = ({ component: Component, ...rest }) => (
  <MyContext.Consumer>
    {context => (
      <Route
        {...rest}
        render={props =>
          context.state.isLoggedIn ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    )}
  </MyContext.Consumer>
)

export default PrivateRoute
