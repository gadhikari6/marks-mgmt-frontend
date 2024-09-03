import { Link } from "react-router-dom"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Toolbar from "@mui/material/Toolbar"
import DashboardIcon from "@mui/icons-material/Dashboard"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import GroupIcon from "@mui/icons-material/Group"
import SchoolIcon from "@mui/icons-material/School"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode"
export default function AdminDrawer() {
  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[
          { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
          { text: "Users", icon: <GroupIcon />, link: "/users" },
          { text: "Teachers", icon: <GroupIcon />, link: "/teachers" },
          {
            text: "Students",
            icon: <GroupIcon />,
            link: "/students",
          },
          {
            text: "Marks",
            icon: <ChromeReaderModeIcon />,
            link: "/adminmarks",
          },
          {
            text: "Manage Courses",
            icon: <BookmarkIcon />,
            link: "/addcourses",
          },
          {
            text: "Academic Divisions",
            icon: <SchoolIcon />,
            link: "/divisions",
          },
          {
            text: "Manage Batch",
            icon: <AddCircleOutlineIcon />,
            link: "/createbatch",
          },
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
