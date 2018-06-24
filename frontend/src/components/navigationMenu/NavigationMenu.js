import React, { Fragment } from "react"

import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
  toolbar: theme.mixins.toolbar
})

const NavigationMenu = props => {
  return (
    <Fragment>
      <div className={props.classes.toolbar} />
      NavigationMenu
    </Fragment>
  )
}

export default withStyles(styles)(NavigationMenu)
