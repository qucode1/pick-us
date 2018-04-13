import React from "react"

export const ErrorContext = React.createContext({
  error: {},
  setError: e => (this.error = e)
})
