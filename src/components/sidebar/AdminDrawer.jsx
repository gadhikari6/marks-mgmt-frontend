import { Link } from "react-router-dom"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Toolbar from "@mui/material/Toolbar"
import DashboardIcon from "@mui/icons-material/Dashboard"
import AccountBoxIcon from "@mui/icons-material/AccountBox"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import GroupIcon from "@mui/icons-material/Group"

export default function AdminDrawer() {
  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[
          { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
          { text: "Profile", icon: <AccountBoxIcon />, link: "/profile" },
          { text: "Add Courses", icon: <BookmarkIcon />, link: "/addcourses" },
          { text: "Teachers", icon: <GroupIcon />, link: "/teachers" },
          {
            text: "Students",
            icon: <GroupIcon />,
            link: "/students",
          },
          { text: "Users", icon: <GroupIcon />, link: "/users" },
        ].map((item) => (
          <ListItem
            key={item.text}
            disablePadding
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
}
