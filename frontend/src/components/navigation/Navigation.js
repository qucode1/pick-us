import React, { Fragment, Component } from "react"

import Drawer from "@material-ui/core/Drawer"
import Hidden from "@material-ui/core/Hidden"
import { withStyles } from "@material-ui/core/styles"

import NavigationMenu from "../navigationMenu/NavigationMenu"

const styles = theme => ({
  root: {
    width: theme.spacing.drawerWidth,
    maxWidth: "75%"
  }
})

class Navigation extends Component {
  state = {
    mobileOpen: false
  }
  render() {
    return (
      <nav>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={"left"}
            open={this.props.mobileNavOpen}
            onClose={this.props.toggleMobileNav}
            ModalProps={{
              keepMounted: true
            }}
            classes={{ paper: this.props.classes.root }}
          >
            <NavigationMenu />
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            variant="permanent"
            open
            classes={{ paper: this.props.classes.root }}
          >
            <NavigationMenu />
          </Drawer>
        </Hidden>
      </nav>
    )
  }
}

export default withStyles(styles)(Navigation)
