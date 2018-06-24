import React from "react"
import ReactDOM from "react-dom"
import { ApolloProvider } from "react-apollo"
import ApolloClient from "apollo-boost"
import registerServiceWorker from "./registerServiceWorker"
import { BrowserRouter as Router } from "react-router-dom"

import "./index.css"

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider" // add
import { createMuiTheme } from "@material-ui/core/styles"

import App from "./components/app/App"

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  fetchOptions: {
    useGETForQueries: true,
    credentials: "include"
  },
  request: async operation => {
    const idToken = localStorage.getItem("idToken")
    const profileToken = localStorage.getItem("profileToken")
    operation.setContext({
      headers: {
        id_token: idToken || "",
        profile_token: profileToken || ""
      }
    })
  }
})

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(46, 112, 185)"
    },
    secondary: {
      main: "rgb(34, 187, 141)"
    }
  },
  spacing: {
    drawerWidth: "250px"
  }
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
)
registerServiceWorker()
