import React from "react"
import { NavLink } from "react-router-dom"
import { withStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import HomeIcon from "@material-ui/icons/Home"
import PeopleIcon from "@material-ui/icons/People"
import PortraitIcon from "@material-ui/icons/Portrait"

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  activeNavLink: {
    backgroundColor: theme.palette.action.hover
  }
})

const NavigationMenu = props => {
  return (
    <List component="nav">
      <ListItem className={props.classes.toolbar} />
      <ListItem
        button
        component={NavLink}
        to="/"
        activeClassName={props.classes.activeNavLink}
        exact
      >
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem
        button
        component={NavLink}
        to="/profile"
        activeClassName={props.classes.activeNavLink}
      >
        <ListItemIcon>
          <PortraitIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem
        button
        component={NavLink}
        to="/users"
        activeClassName={props.classes.activeNavLink}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItem>
    </List>
  )
}

export default withStyles(styles)(NavigationMenu)
