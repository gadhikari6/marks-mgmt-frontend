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

import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react"
import { useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"

import { toast } from "react-toastify"
import { Divider } from "@mui/material"

const drawerWidth = 240

function ResponsiveDrawer(props) {
  const { loginState, dispatchLoginState } = useContext(LoginContext)
  const [role, setRole] = useState("")
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [selectedRole, setSelectedRole] = useState(loginState.roles.currentRole)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    dispatchLoginState({ type: "LOGOUT" })
    toast.warn("You have been logged out!")
  }
  //here
  useEffect(() => {
    setRole(loginState.roles.currentRole)
  }, [loginState])

  const handleRoleChange = (event) => {
    const newRole = event.target.value
    setSelectedRole(newRole)
    setOpenDialog(true)
  }

  const handleConfirmRoleChange = () => {
    dispatchLoginState({
      type: "CHANGE_ROLE",
      payload: {
        role: selectedRole,
      },
    })
    setOpenDialog(false)
  }

  const handleCancelRoleChange = () => {
    setOpenDialog(false)
  }

  // what does this do ?? need comment here!
  const container =
    window !== undefined ? () => window().document.body : undefined

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {/* role selector */}

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
          <Typography
            sx={{
              marginLeft: 40,
              // border: 1,
            }}
          >
            Role:{" "}
            <span style={{ marginRight: "1.5rem" }}>
              {loginState.roles.currentRole}
            </span>
            {loginState.roles.allRoles.length > 1 ? (
              <>
                Change Role:
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={role}
                  label="Role"
                  onChange={handleRoleChange}
                  sx={{
                    color: "white",
                    border: "1px solid white",
                    marginLeft: 1,
                  }}
                >
                  {loginState.roles.allRoles.map((role) => {
                    return (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    )
                  })}
                </Select>
              </>
            ) : null}
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

      <Dialog open={openDialog} onClose={handleCancelRoleChange}>
        <DialogTitle>Confirm Role Change</DialogTitle>
        <Divider />
        <DialogContent>
          Do you want to switch to the role: {selectedRole}?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmRoleChange}
            color="primary"
            variant="outlined"
          >
            Confirm
          </Button>
          <Button
            onClick={handleCancelRoleChange}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
}

export default ResponsiveDrawer
