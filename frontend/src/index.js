import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from "apollo-boost"
import registerServiceWorker from './registerServiceWorker'
import { BrowserRouter as Router } from "react-router-dom"


import './index.css'

import App from './App'


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
    useGETForQueries: true
  },
  request: async (operation) => {
    const accessToken = localStorage.getItem("accessToken")
    const profileToken = localStorage.getItem("profileToken")
    operation.setContext({
      headers: {
        access_token: accessToken || "",
        profile_token: profileToken || ""
      }
    })
  }
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()
