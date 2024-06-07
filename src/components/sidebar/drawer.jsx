// drawer.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import SettingsIcon from '@mui/icons-material/Settings'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

const drawerWidth = 240

function ResponsiveDrawer(props) {
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const location = useLocation()
  const currentPage = location.pathname

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuItemClick = () => {
    console.log(currentPage)
    setMobileOpen(false)
  
    if (currentPage === "/logout") {
      // Clear localStorage and navigate to the login page
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
          { text: 'Marks', icon: <BookmarkIcon />, link: '/marks' },

          { text: 'Profile', icon: <AccountBoxIcon />, link: '/profile' },
          { text: 'Settings', icon: <SettingsIcon />, link: '/settings' },
          { text: 'Logout', icon: <ExitToAppIcon />, link: '/logout' },
        ].map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            selected={currentPage === item.link}
            onClick={handleMenuItemClick}
            button
            component={Link}
            to={item.link}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            IMMS
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  )
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
}

export default ResponsiveDrawer
