// drawer.jsx
import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuIcon from "@mui/icons-material/Menu"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import { useContext } from "react"
import { LoginContext } from "../../store/LoginProvider"
import StudentDrawer from "./StudentDrawer"
import AdminDrawer from "./AdminDrawer"
import TeacherDrawer from "./TeacherDrawer"
import SettingsIcon from "@mui/icons-material/Settings"

import { toast } from "react-toastify"

const drawerWidth = 240

function ResponsiveDrawer(props) {
  const { loginState, dispatchLoginState } = useContext(LoginContext)
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    dispatchLoginState({ type: "LOGOUT" })
    toast.warn("You have been logged out!")
  }

  // what does this do ?? need comment here!
  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Internal Marks Management System
          </Typography>
          <Typography sx={{ marginLeft: 10, border: 1 }}>
            Current Role: {loginState.roles.currentRole} | Add a option to
            change role heres
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {/* Donot put items in here. Also do not remote it */}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {/* put drawer items here */}
          {loginState.roles.currentRole === "student" && <StudentDrawer />}
          {loginState.roles.currentRole === "admin" && <AdminDrawer />}
          {loginState.roles.currentRole === "teacher" && <TeacherDrawer />}

          {/* Permanent settings and logout button */}
          <ListItem
            key="Settings"
            disablePadding
            component={Link}
            button
            to={"/settings"}
          >
            <ListItemButton>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>

          <ListItem
            key="Logout"
            disablePadding
            component={Link}
            onClick={handleLogout}
            button
          >
            <ListItemButton>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
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
