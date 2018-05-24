import React from "react"

import { withStyles } from "material-ui/styles"
import Typography from "material-ui/Typography"

const styles = theme => ({
  root: {
    position: "relative",
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
    <Typography variant="subheading">Loading...</Typography>
  </div>
)

export default withStyles(styles)(Loading)
