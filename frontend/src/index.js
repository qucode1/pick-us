import React from "react"
import ReactDOM from "react-dom"
import { ApolloProvider } from "react-apollo"
import ApolloClient from "apollo-boost"
import registerServiceWorker from "./registerServiceWorker"
import { BrowserRouter as Router } from "react-router-dom"

import "./index.css"

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider" // add

import App from "./App"

const client = new ApolloClient({
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

ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider>
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
)
registerServiceWorker()
