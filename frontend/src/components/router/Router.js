import React, { Fragment } from "react"
import { Route, Switch, Redirect } from "react-router-dom"

import PrivateRoute from "../../utils/PrivateRoute"

import Callback from "../callback/Callback"
import Dashboard from "../dashboard/Dashboard"
import MyProfile from "../myProfile/myProfile"
import Landing from "../landing/Landing"
import ErrorComponent from "../error/Error"
import AddUser from "../addUser/AddUser"
import AddedUser from "../addedUser/AddedUser"
import UserProfile from "../userProfile/UserProfile"

const Router = props => {
  return (
    <Fragment>
      <Route
        exact
        path="/"
        component={props.isLoggedIn ? Dashboard : Landing}
      />
      <Switch>
        <PrivateRoute exact path="/profile" component={MyProfile} />
        <PrivateRoute exact path="/users/add" component={AddUser} />
        <PrivateRoute exact path="/users/add/success" component={AddedUser} />
        <PrivateRoute exact path="/users/:id" component={UserProfile} />
        <PrivateRoute exact path="/callback" component={Callback} />
        <Route exact path="/error" component={ErrorComponent} />
        <Route exact path="/logout" render={() => <Redirect to="/" />} />
        <Route
          exact
          path="/:anythingElse"
          render={() => (
            <ErrorComponent errorProp="There is nothing to see here :(" />
          )}
        />
      </Switch>
    </Fragment>
  )
}

export default Router
