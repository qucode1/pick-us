import React, { Fragment } from "react"
import { Link } from "react-router-dom"
const ErrorComponent = ({ err }) => (
  <Fragment>
    <h3>Error Component</h3>
    <p>{err}</p>
    <Link to="/">Home</Link>
  </Fragment>
)

export default ErrorComponent
