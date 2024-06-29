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
import AutoStoriesIcon from "@mui/icons-material/AutoStories"

export default function TeacherDrawer() {
  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[
          { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
          {
            text: "Courses",
            icon: <AutoStoriesIcon />,
            link: "/teacherCourses",
          },
          { text: " Add Marks", icon: <BookmarkIcon />, link: "/addmarks" },
          { text: "Profile", icon: <AccountBoxIcon />, link: "/profile" },
        ].map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            component={Link}
            button
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
