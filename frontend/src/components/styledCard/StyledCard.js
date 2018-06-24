import React from "react"
import { withStyles } from "@material-ui/core"
import Card from "@material-ui/core/Card"

const styles = theme => ({
  card: {
    margin: `${theme.spacing.unit * 2}px auto`,
    width: "75%",
    maxWidth: "1000px",
    [theme.breakpoints.down("md")]: {
      width: "95%"
    }
  }
})

const StyledCard = props => (
  <Card className={props.classes.card}>{props.children}</Card>
)

export default withStyles(styles)(StyledCard)
