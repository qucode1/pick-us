import React from "react"
import ReactDOM from "react-dom"
import { ApolloProvider } from "react-apollo"
import registerServiceWorker from "./registerServiceWorker"
import { BrowserRouter as Router } from "react-router-dom"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { onError } from "apollo-link-error"
import { ApolloLink } from "apollo-link"
import { createUploadLink } from "apollo-upload-client"

import "./index.css"

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider" // add
import { createMuiTheme } from "@material-ui/core/styles"

import App from "./components/app/App"

const authMiddleware = new ApolloLink((operation, forward) => {
  const idToken = localStorage.getItem("idToken")
  const profileToken = localStorage.getItem("profileToken")
  operation.setContext({
    headers: {
      id_token: idToken || "",
      profile_token: profileToken || ""
    }
  })
  return forward(operation)
})

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        )
      if (networkError) console.log(`[Network error]: ${networkError}`)
    }),
    authMiddleware,
    createUploadLink({
      uri: "http://localhost:4000/graphql",
      credentials: "same-origin",
      useGETForQueries: true
    })
  ]),
  cache: new InMemoryCache()
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
