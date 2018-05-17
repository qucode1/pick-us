import React from "react"

import { withStyles } from "material-ui/styles"

const styles = theme => ({
  root: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAllign: "center"
  }
})

const Loading = ({ classes }) => (
  <div className={classes.root}>
    <p>Loading...</p>
  </div>
)

export default withStyles(styles)(Loading)
