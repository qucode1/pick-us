import React, { Fragment } from "react"
import { Redirect } from "react-router-dom"
import { Query } from "react-apollo"
import gql from "graphql-tag"

import Loading from "../loading/Loading"

import { MyContext } from "../../utils/contextProvider"

import { withStyles } from "material-ui/styles/"
import Button from "material-ui/Button" // add
import Avatar from "material-ui/Avatar"

import yoga from "../../yoga.png"

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
  avatar: {
    margin: 10,
    backgroundColor: "#efefef",
    color: "#333"
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
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
          <header className="App-header">
            <img src={yoga} className="App-logo" alt="logo" />
            <h1 className="App-title">
              Welcome to <code>graphql-yoga</code>
            </h1>
            {props.isLoggedIn ? (
              <Button
                className={props.classes.button}
                variant="raised"
                onClick={props.logout}
              >
                Logout
              </Button>
            ) : (
              <Button
                className={props.classes.button}
                variant="raised"
                onClick={props.login}
              >
                Login
              </Button>
            )}
            {props.isLoggedIn &&
              data.me &&
              data.me.firstName && (
                <Avatar className={props.classes.avatar}>
                  {data.me.firstName[0]}
                  {data.me.lastName[0]}
                </Avatar>
              )}
          </header>
        )
      }
    }}
  </Query>
  // ) : (
  //   <header className="App-header">
  //     <img src={yoga} className="App-logo" alt="logo" />
  //     <h1 className="App-title">
  //       Welcome to <code>graphql-yoga</code>
  //     </h1>
  //     {props.isLoggedIn ? (
  //       <Button
  //         className={props.classes.button}
  //         variant="raised"
  //         onClick={props.logout}
  //       >
  //         Logout
  //       </Button>
  //     ) : (
  //       <Button
  //         className={props.classes.button}
  //         variant="raised"
  //         onClick={props.login}
  //       >
  //         Login
  //       </Button>
  //     )}
  // </header>
)

export default withStyles(styles)(Header)
