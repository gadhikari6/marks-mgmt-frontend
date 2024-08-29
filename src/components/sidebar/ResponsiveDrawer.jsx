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
import useProfile from "../../hooks/useProfile"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import AccountBoxIcon from "@mui/icons-material/AccountBox"

const drawerWidth = 240

function ResponsiveDrawer(props) {
  const { loginState, dispatchLoginState } = useContext(LoginContext)
  const [role, setRole] = useState("")
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [selectedRole, setSelectedRole] = useState(loginState.roles.currentRole)
  const { data: profileData } = useProfile()

  // Dialog state for logout
  const [logoutDialog, setLogoutDialog] = useState(false)

  // Dialog state for role Change
  const [openRoleChangeDialog, setOpenRoleChangeDialog] = useState(false)

  // queryClient
  const queryClient = useQueryClient()

  const [name, setName] = useState("")

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = async () => {
    // invalidate all caches in react-query before logout
    queryClient.invalidateQueries()

    dispatchLoginState({ type: "LOGOUT" })
    toast.warn("You have been logged out!")
  }

  // set role from context
  useEffect(() => {
    setRole(loginState.roles.currentRole)
  }, [loginState])

  // set name from profile
  useEffect(() => {
    if (profileData !== undefined && profileData !== null) {
      setName(profileData.name)
    }
  }, [profileData])

  const handleRoleChange = (event) => {
    const newRole = event.target.value
    setSelectedRole(newRole)
    setOpenRoleChangeDialog(true)
  }

  const handleConfirmRoleChange = () => {
    dispatchLoginState({
      type: "CHANGE_ROLE",
      payload: {
        role: selectedRole,
      },
    })
    setOpenRoleChangeDialog(false)
  }

  const handleCancelRoleChange = () => {
    setOpenRoleChangeDialog(false)
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

          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              justifyItems: "center",
              alignContent: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Typography>
                {name === "" ? "Role" : <b>{name}</b>} :
                {loginState.roles.currentRole}
              </Typography>
            </Box>
            <Box>
              <Typography>
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
                            {role}{" "}
                            {role === loginState.roles.currentRole && "*"}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </>
                ) : null}
              </Typography>
            </Box>
          </Box>
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
          {/* Donot put items in here. Also do not remove this drawer */}
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
            key="Profile"
            disablePadding
            component={Link}
            button
            to={"/profile"}
          >
            <ListItemButton>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>

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
            onClick={() => {
              setLogoutDialog(true)
            }}
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

      <Dialog open={openRoleChangeDialog} onClose={handleCancelRoleChange}>
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

      <Dialog
        open={logoutDialog}
        onClose={() => {
          setLogoutDialog(false)
        }}
      >
        <DialogTitle>Confirm Logout?</DialogTitle>
        <Divider />
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleLogout} color="primary" variant="outlined">
            Confirm
          </Button>
          <Button
            onClick={() => {
              setLogoutDialog(false)
            }}
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
