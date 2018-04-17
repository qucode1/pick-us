import React, { Fragment } from "react"
import { Link } from "react-router-dom"

const Landing = () => (
  <Fragment>
    <h3>Landing Component</h3>
    <Link to="/profile">Profile</Link>
    <Link to="/test">Test</Link>
  </Fragment>
)

export default Landing
